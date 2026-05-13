import axios from "axios";
import FormData from "form-data";
import {Readable} from "node:stream";
import {
	DEEPSEEK_UPLOAD_FILE_URL,
	DEEPSEEK_CREATE_POW_URL,
	DEEPSEEK_FETCH_FILES_URL,
	getHistoryHeaders,
	OUTPUT_INTEGRITY_GUARD,
	RULES_FILENAME,
	TOOLS_FILENAME,
	CONTENT_TYPE,
	FILE_READY_POLL_ATTEMPTS,
	FILE_READY_POLL_INTERVAL_MS,
} from "@/constants";
import {logWithPort} from "@/handlers/ServerHelpers";
import {solveAndBuildHeader} from "@/ipcs/Pow";
import {buildToolPrompt} from "@/server/ToolSieve";
import type {CachedRuleFiles} from "@/types/RuleUploader";

const fileCache = new Map<string, CachedRuleFiles>();

export function buildRulesText(systemMessages: string[]): string {
	const parts: string[] = [
		`# ${RULES_FILENAME}`,
		"",
		"## Output Integrity",
		OUTPUT_INTEGRITY_GUARD,
	];

	if (systemMessages.length > 0) {
		parts.push("");
		parts.push("## System Instructions");
		for (const msg of systemMessages) {
			const trimmed = msg.trim();
			if (trimmed) {
				parts.push("");
				parts.push(trimmed);
			}
		}
	}

	return parts.join("\n") + "\n";
}

export function buildToolsText(tools: unknown[]): string {
	const toolPrompt = buildToolPrompt(tools as any[]);
	if (!toolPrompt) return "";

	return `# ${TOOLS_FILENAME}\nAvailable tool descriptions and parameter schemas for this request.\n\n${toolPrompt}\n`;
}

export async function uploadRuleFiles(
	token: string,
	systemMessages: string[],
	tools: unknown[],
	port: number,
): Promise<{
	rulesFileId: string;
	toolsFileId: string | null;
	refFileIds: string[];
}> {
	const rulesText = buildRulesText(systemMessages);
	const toolsText = buildToolsText(tools);

	const rulesHash = simpleHash(rulesText);
	const toolsHash = simpleHash(toolsText);

	const cached = fileCache.get(token);
	if (
		cached &&
		cached.rulesHash === rulesHash &&
		cached.toolsHash === toolsHash &&
		Date.now() - cached.createdAt < 25 * 60 * 1000
	) {
		const refFileIds = [cached.rulesFileId];
		if (cached.toolsFileId) refFileIds.push(cached.toolsFileId);
		return {
			rulesFileId: cached.rulesFileId,
			toolsFileId: cached.toolsFileId,
			refFileIds,
		};
	}

	const rulesFileId = await uploadTextFile(token, RULES_FILENAME, rulesText, port);

	let toolsFileId: string | null = null;
	if (toolsText.trim()) {
		toolsFileId = await uploadTextFile(token, TOOLS_FILENAME, toolsText, port);
	}

	fileCache.set(token, {
		rulesFileId,
		toolsFileId,
		toolsHash,
		rulesHash,
		createdAt: Date.now(),
	});

	const refFileIds = [rulesFileId];
	if (toolsFileId) refFileIds.push(toolsFileId);
	return {rulesFileId, toolsFileId, refFileIds};
}

export function clearRuleFileCache(token: string): void {
	fileCache.delete(token);
}

export function clearAllRuleFileCache(): void {
	fileCache.clear();
}

export function buildLivePrompt(
	userMessage: string,
	hasToolsFile: boolean,
): string {
	let instruction = `Follow the instructions in the attached ${RULES_FILENAME}.`;

	if (hasToolsFile) {
		instruction += ` Available tool descriptions and parameter schemas are attached in ${TOOLS_FILENAME}; use only those tools and follow the tool-call format rules described there.`;
	}

	return `${instruction}\n\n${userMessage}`;
}

async function uploadTextFile(
	token: string,
	filename: string,
	content: string,
	port: number,
): Promise<string> {
	// 1. Get PoW challenge for upload endpoint
	const powResponse = await axios.post(
		DEEPSEEK_CREATE_POW_URL,
		{target_path: "/api/v0/file/upload_file"},
		{
			headers: getHistoryHeaders(token),
			validateStatus: () => true,
		},
	);

	if (powResponse.status !== 200 || powResponse.data?.code !== 0) {
		throw new Error(`[rule-uploader] PoW challenge failed for ${filename}`);
	}

	const challenge = powResponse.data?.data?.biz_data?.challenge;
	const powHeaderStr = solveAndBuildHeader(challenge);

	// 2. Build multipart form data with text content as a file
	const formData = new FormData();
	const buffer = Buffer.from(content, "utf-8");
	formData.append("file", Readable.from(buffer), {
		filename,
		contentType: CONTENT_TYPE,
		knownLength: buffer.length,
	});

	// 3. Upload
	const headers = {
		...getHistoryHeaders(token),
		"x-ds-pow-response": powHeaderStr,
		"x-file-size": String(buffer.length),
		...formData.getHeaders(),
	};

	const response = await axios.post(DEEPSEEK_UPLOAD_FILE_URL, formData, {
		headers,
		maxBodyLength: Infinity,
		maxContentLength: Infinity,
		validateStatus: () => true,
	});

	if (response.status !== 200 || response.data?.code !== 0) {
		throw new Error(
			`[rule-uploader] Upload failed for ${filename}: ${response.status} ${JSON.stringify(response.data).slice(0, 200)}`,
		);
	}

	const fileId = extractFileId(response.data);
	if (!fileId) {
		throw new Error(
			`[rule-uploader] Upload succeeded but no file ID for ${filename}`,
		);
	}

	// 4. Extract initial status and wait for "processed" if needed
	const initialStatus = extractFileStatus(response.data);
	if (!isReadyFileStatus(initialStatus)) {
		logWithPort(
			port,
			`[rule-uploader] Uploaded ${filename} → ${fileId.slice(0, 12)}... (status: ${initialStatus}, waiting for ready...)`,
		);
		await waitForFileReady(token, fileId, filename, port);
	} else {
		logWithPort(
			port,
			`[rule-uploader] Uploaded ${filename} → ${fileId.slice(0, 12)}... (ready)`,
		);
	}

	return fileId;
}

async function waitForFileReady(
	token: string,
	fileId: string,
	filename: string,
	port: number,
): Promise<void> {
	for (let attempt = 0; attempt < FILE_READY_POLL_ATTEMPTS; attempt++) {
		await sleep(FILE_READY_POLL_INTERVAL_MS);

		try {
			const status = await fetchFileStatus(token, fileId);
			if (isReadyFileStatus(status)) {
				logWithPort(
					port,
					`[rule-uploader] ${filename} ready after ${attempt + 1} poll(s)`,
				);
				return;
			}
		} catch (err) {
			logWithPort(
				port,
				`[rule-uploader] poll error for ${filename} (attempt ${attempt + 1}): ${err instanceof Error ? err.message : String(err)}`,
			);
		}
	}

	logWithPort(
		port,
		`[rule-uploader] ${filename} (${fileId.slice(0, 12)}...) did not reach 'processed' after ${FILE_READY_POLL_ATTEMPTS} polls, proceeding anyway`,
	);
}

async function fetchFileStatus(token: string, fileId: string): Promise<string> {
	const url = `${DEEPSEEK_FETCH_FILES_URL}?file_ids=${encodeURIComponent(fileId)}`;
	const response = await axios.get(url, {
		headers: getHistoryHeaders(token),
		validateStatus: () => true,
	});

	if (response.status !== 200 || response.data?.code !== 0) {
		throw new Error(`fetch_files failed: ${response.status}`);
	}

	return findFileStatusInResponse(response.data, fileId);
}

function findFileStatusInResponse(data: any, targetId: string): string {
	if (!data || typeof data !== "object") return "";

	if (Array.isArray(data)) {
		for (const item of data) {
			const found = findFileStatusInResponse(item, targetId);
			if (found) return found;
		}
		return "";
	}

	const id = data.id || data.file_id || "";
	if (typeof id === "string" && id.trim() === targetId) {
		return (data.status || data.file_status || "").toString().trim();
	}

	for (const key of Object.keys(data)) {
		const val = data[key];
		if (val && typeof val === "object") {
			const found = findFileStatusInResponse(val, targetId);
			if (found) return found;
		}
	}

	return "";
}

function isReadyFileStatus(status: string): boolean {
	switch (status.toLowerCase().trim()) {
		case "processed":
		case "ready":
		case "done":
		case "available":
		case "success":
		case "completed":
		case "finished":
			return true;
		default:
			return false;
	}
}

function extractFileId(data: any): string | null {
	const bizData = data?.data?.biz_data;
	if (typeof bizData?.id === "string" && bizData.id.trim()) {
		return bizData.id.trim();
	}
	if (typeof bizData?.file?.id === "string" && bizData.file.id.trim()) {
		return bizData.file.id.trim();
	}
	if (typeof data?.data?.id === "string" && data.data.id.trim()) {
		return data.data.id.trim();
	}
	return null;
}

function extractFileStatus(data: any): string {
	const bizData = data?.data?.biz_data;
	if (typeof bizData?.status === "string") return bizData.status.trim();
	if (typeof bizData?.file_status === "string")
		return bizData.file_status.trim();
	if (typeof bizData?.file?.status === "string")
		return bizData.file.status.trim();
	return "uploaded";
}

function simpleHash(text: string): string {
	let hash = 0;
	for (let i = 0; i < text.length; i++) {
		const ch = text.charCodeAt(i);
		hash = ((hash << 5) - hash + ch) | 0;
	}
	return hash.toString(36);
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
