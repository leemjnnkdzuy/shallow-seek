import type { ApiKey } from "../types";

export async function deleteApiKey(
	key: ApiKey,
	tokenToUse: string,
	callbacks: {
		fetchKeys: () => void;
	}
) {
	const confirmed = await window.electron?.windowControls.openConfirm({
		title: "Xóa API Key",
		message: `Bạn có chắc chắn muốn xóa API Key "${key.name}"? Các ứng dụng đang sử dụng key này sẽ không thể truy cập được nữa.`,
		confirmText: "Xóa",
		cancelText: "Hủy",
		variant: "destructive",
		type: "danger",
	});

	if (confirmed) {
		try {
			const res = await window.electron?.deepseek?.editApiKeys({
				token: tokenToUse,
				body: {
					action: "delete",
					name: null,
					redacted_key: key.sensitive_id,
					created_at: key.created_at,
				},
			});

			if (res?.ok && res.data?.code === 0) {
				callbacks.fetchKeys();
			} else {
				console.error("Failed to delete key:", res);
			}
		} catch (err) {
			console.error("Error deleting key:", err);
		}
	}
}
