export interface ApiKey {
	created_at: number;
	last_use: string | null;
	tracking_id: string;
	sensitive_id: string;
	name: string;
}

export interface FetchKeysCallbacks {
	setKeys: (keys: ApiKey[]) => void;
	setPlatformToken: (token: string | null) => void;
	setError40003: (error: boolean) => void;
	setLoading: (loading: boolean) => void;
}

export async function fetchApiKeys(
	platformToken: string | null,
	callbacks: FetchKeysCallbacks
) {
	if (!platformToken) {
		callbacks.setError40003(true);
		return;
	}

	callbacks.setLoading(true);
	try {
		const res = await window.electron?.deepseek?.getApiKeys({
			token: platformToken,
		});

		if (res?.ok && res.data?.code === 0 && res.data?.data?.biz_data?.api_keys) {
			callbacks.setKeys(res.data.data.biz_data.api_keys);
			callbacks.setError40003(false);
		} else if (
			res?.data?.code === 40003 ||
			res?.error?.message?.includes("40003") ||
			(res?.ok && res?.data?.code !== 0)
		) {
			callbacks.setPlatformToken(null);
			callbacks.setError40003(true);
		} else {
			console.error("Failed to fetch keys:", res);
		}
	} catch (err) {
		console.error("Error fetching keys:", err);
	} finally {
		callbacks.setLoading(false);
	}
}

export async function connectPlatform(
	accountId: string,
	callbacks: {
		setLoading: (loading: boolean) => void;
		setPlatformToken: (token: string | null) => void;
		setError40003: (error: boolean) => void;
		fetchKeys: () => void;
	}
) {
	callbacks.setLoading(true);
	try {
		const result = await window.electron?.deepseek?.login({ email: "", password: "", deviceId: "" });
		if (result?.ok && result.platformToken) {
			await window.electron?.db.setSetting(
				`platform_token_${accountId}`,
				result.platformToken
			);
			callbacks.setPlatformToken(result.platformToken);
			callbacks.setError40003(false);
			callbacks.fetchKeys();
		}
	} catch (err) {
		console.error("Failed to connect platform:", err);
	} finally {
		callbacks.setLoading(false);
	}
}

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
