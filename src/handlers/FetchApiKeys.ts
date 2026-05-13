import type { FetchKeysCallbacks } from "../types";

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
