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
