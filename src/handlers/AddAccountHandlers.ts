import {getShumeiDeviceId} from "@/services/DeepseekDevice";
import {DEEPSEEK_LOGIN_URL} from "@/constants";
import {maskIdentifier, previewValue} from "@/lib/utils";
import type {DeepseekLoginResponse} from "@/types";

export const buildLoginErrorLog = (params: {
	err: unknown;
	email: string;
	deviceId: string;
}) => {
	const {err, email, deviceId} = params;
	return {
		at: new Date().toISOString(),
		url: DEEPSEEK_LOGIN_URL,
		emailMasked: maskIdentifier(email),
		deviceIdPrefix: deviceId ? deviceId.slice(0, 8) : "",
		deviceIdLength: deviceId.length,
		online: navigator.onLine,
		origin: window.location.origin,
		userAgent: navigator.userAgent,
		err: previewValue(err),
	};
};

export async function handleLogin(
	username: string,
	password: string,
	callbacks: {
		setEmailExists: (exists: boolean) => void;
		setErrorMessage: (msg: string) => void;
		setPhase: (phase: 1 | 2) => void;
		setStatus: (status: "loading" | "success" | "error") => void;
	}
) {
	if (!username || !password) return;

	callbacks.setEmailExists(false);
	callbacks.setErrorMessage("");

	const check = await window.electron?.db.checkAccountExists(username.trim());
	if (check?.success && check.exists) {
		callbacks.setEmailExists(true);
		callbacks.setErrorMessage("Tài khoản này đã tồn tại trong hệ thống.");
		return;
	} else if (check && !check.success) {
		console.error("Failed to check account existence:", check.error);
	}

	callbacks.setPhase(2);
	callbacks.setStatus("loading");

	let deviceId = "";

	try {
		deviceId = await getShumeiDeviceId();

		const result = await window.electron?.deepseek?.login({
			email: username,
			password,
			deviceId,
		});

		if (!result) {
			throw new Error("Electron bridge unavailable");
		}

		if (!result.ok) {
			const logPayload = {
				...buildLoginErrorLog({
					err: result.error,
					email: username,
					deviceId,
				}),
				source: "main",
				error: result.error,
			};
			console.groupCollapsed("[DeepSeek] Login failed (main)");
			console.error(logPayload);
			console.groupEnd();
			window.electron?.log?.(logPayload);

			callbacks.setStatus("error");
			callbacks.setErrorMessage(
				result.error?.code
					? `${result.error.message} (${result.error.code})`
					: result.error?.message || "Network Error"
			);
			return;
		}

		const responseData = result.data as DeepseekLoginResponse;

		if (
			responseData &&
			responseData.code === 0 &&
			responseData.data?.biz_code === 0
		) {
			const user = responseData.data?.biz_data?.user;
			if (!user) {
				callbacks.setStatus("error");
				callbacks.setErrorMessage("Thiếu dữ liệu người dùng từ máy chủ.");
				return;
			}

			const res = await window.electron?.db.addAccount({
				id: user.id,
				email: user.email,
				chat_token: user.token,
				platform_token: result.platformToken || undefined,
			});

			if (res?.success) {
				if (result.platformToken) {
					await window.electron?.db.setSetting(
						`platform_token_${user.id}`,
						result.platformToken
					);
				}

				callbacks.setStatus("success");
				setTimeout(() => {
					window.electron?.windowControls.close();
				}, 1500);
			} else {
				callbacks.setStatus("error");
				callbacks.setErrorMessage("Lỗi khi lưu tài khoản vào cơ sở dữ liệu.");
			}
		} else {
			callbacks.setStatus("error");
			callbacks.setErrorMessage(
				responseData?.data?.biz_msg ||
					responseData?.msg ||
					(result.status ? `HTTP ${result.status}` : "Đăng nhập thất bại.")
			);
		}
	} catch (err: unknown) {
		callbacks.setStatus("error");

		const logPayload = {
			...buildLoginErrorLog({err, email: username, deviceId}),
			source: "renderer",
		};
		console.groupCollapsed("[DeepSeek] Login failed (renderer)");
		console.error(logPayload);
		console.groupEnd();
		window.electron?.log?.(logPayload);

		callbacks.setErrorMessage(
			err instanceof Error ? err.message : "Không thể kết nối đến máy chủ."
		);
	}
}
