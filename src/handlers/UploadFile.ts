export interface AttachedFile {
	id?: string;
	name: string;
	size: number;
	status: "uploading" | "parsing" | "success" | "error";
	errorMsg?: string;
}

export interface UploadFileCallbacks {
	onStart: (file: AttachedFile) => void;
	onParsing: (tempId: string, fileId: string) => void;
	onSuccess: (fileId: string) => void;
	onError: (id: string, errorMsg: string) => void;
}

export async function processAndUploadFile(
	file: File,
	chatToken: string,
	callbacks: UploadFileCallbacks
) {
	const filePath = (file as any).path;
	if (!filePath) {
		console.error("File path not available");
		return;
	}

	const tempId = `temp-${Date.now()}`;
	callbacks.onStart({ id: tempId, name: file.name, size: file.size, status: "uploading" });

	try {
		const uploadRes = await window.electron?.deepseek?.uploadFile({
			token: chatToken,
			filePath,
			fileName: file.name,
			fileSize: file.size,
		});

		if (!uploadRes?.ok || !uploadRes?.data?.data?.biz_data?.id) {
			callbacks.onError(tempId, "Upload failed");
			return;
		}

		const fileId = uploadRes.data.data.biz_data.id;
		callbacks.onParsing(tempId, fileId);

		let attempts = 0;
		while (attempts < 20) {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			try {
				const res = await window.electron?.deepseek?.fetchFiles({
					token: chatToken,
					fileIds: [fileId],
				});

				if (res?.ok && res.data?.data?.biz_data?.files?.length > 0) {
					const f = res.data.data.biz_data.files[0];
					if (f.status === "SUCCESS") {
						callbacks.onSuccess(fileId);
						return;
					} else if (f.status === "FAILED") {
						callbacks.onError(fileId, "Parsing failed");
						return;
					}
				}
			} catch (err) {
				// continue
			}
			attempts++;
		}
		callbacks.onError(fileId, "Timeout parsing");
	} catch (err) {
		callbacks.onError(tempId, "Upload error");
	}
}
