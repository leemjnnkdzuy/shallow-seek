import type {ApiKey} from "@/types";

export async function createKey(
	token: string,
	keyName: string,
	callbacks: {
		setCreating: (creating: boolean) => void;
		setErrorMessage: (msg: string) => void;
		setCreatedKey: (key: ApiKey | null) => void;
		setPhase: (phase: 1 | 2) => void;
	}
) {
	const trimmedName = keyName.trim();
	if (!trimmedName || !token) return;

	callbacks.setCreating(true);
	callbacks.setErrorMessage("");
	try {
		const res = await window.electron?.deepseek?.editApiKeys({
			token,
			body: {
				action: "create",
				name: trimmedName,
				redacted_key: null,
				created_at: null,
			},
		});

		if (res?.ok && res.data?.code === 0 && res.data?.data?.biz_data?.api_key) {
			callbacks.setCreatedKey(res.data.data.biz_data.api_key);
			callbacks.setPhase(2);
		} else {
			callbacks.setErrorMessage(
				res?.data?.msg || res?.data?.biz_msg || "Không thể tạo API Key. Vui lòng thử lại."
			);
		}
	} catch (err) {
		console.error("Error creating API key in popup:", err);
		callbacks.setErrorMessage("Có lỗi xảy ra khi kết nối tới hệ thống.");
	} finally {
		callbacks.setCreating(false);
	}
}

export async function copyToClipboard(
	text: string,
	callbacks: {
		setCopied: (copied: boolean) => void;
	}
) {
	try {
		await navigator.clipboard.writeText(text);
		callbacks.setCopied(true);
		setTimeout(() => callbacks.setCopied(false), 2000);
	} catch (err) {
		console.error("Failed to copy key:", err);
	}
}
