import type { ApiKey } from "../types";

export async function renameApiKey(
	key: ApiKey,
	newName: string,
	tokenToUse: string,
	callbacks: {
		setEditingKeyId: (id: string | null) => void;
		setUpdating: (updating: boolean) => void;
		fetchKeys: () => void;
	}
) {
	const trimmedName = newName.trim();
	if (!trimmedName || trimmedName === key.name) {
		callbacks.setEditingKeyId(null);
		return;
	}

	callbacks.setUpdating(true);
	try {
		const res = await window.electron?.deepseek?.editApiKeys({
			token: tokenToUse,
			body: {
				action: "update",
				name: trimmedName,
				redacted_key: key.sensitive_id,
				created_at: key.created_at,
			},
		});

		if (res?.ok && res.data?.code === 0) {
			callbacks.setEditingKeyId(null);
			callbacks.fetchKeys();
		} else {
			console.error("Failed to rename key:", res);
		}
	} catch (err) {
		console.error("Error renaming key:", err);
	} finally {
		callbacks.setUpdating(false);
	}
}
