export const DEEPSEEK_LOGIN_URL =
	"https://chat.deepseek.com/api/v0/users/login";

export const getLoginRequestBody = (
	email: string,
	password: string,
	_deviceId: string,
): {
	email: string;
	mobile: string;
	password: string;
	area_code: string;
	device_id: string;
	os: string;
} => ({
	email,
	mobile: "",
	password,
	area_code: "",
	device_id: "deepseek_to_api",
	os: "android",
});

export const getLoginHeaders = () => ({
	accept: "application/json",
	"accept-language": "zh-CN",
	"cache-control": "no-cache",
	"content-type": "application/json",
	pragma: "no-cache",
	"user-agent": "DeepSeek/2.0.4 Android/35",
	"x-client-locale": "zh_CN",
	"x-client-platform": "android",
	"x-client-timezone-offset": "28800",
	"x-client-version": "2.0.4",
});

export const DEEPSEEK_HISTORY_URL =
	"https://chat.deepseek.com/api/v0/chat_session/fetch_page?lte_cursor.pinned=false";

export const DEEPSEEK_CREATE_POW_URL =
	"https://chat.deepseek.com/api/v0/chat/create_pow_challenge";

export const DEEPSEEK_COMPLETION_URL = "https://chat.deepseek.com/api/v0/chat/completion";
export const DEEPSEEK_HISTORY_MESSAGES_URL = "https://chat.deepseek.com/api/v0/chat/history_messages";
export const DEEPSEEK_CREATE_SESSION_URL = "https://chat.deepseek.com/api/v0/chat_session/create";
export const DEEPSEEK_DELETE_SESSION_URL = "https://chat.deepseek.com/api/v0/chat_session/delete";

export const DEEPSEEK_COMPLETION_TARGET_PATH = "/api/v0/chat/completion";

export const getHistoryHeaders = (token: string, cookies?: string) => {
	const headers: any = {
		"Accept": "application/json",
		"Accept-Charset": "UTF-8",
		"Authorization": `Bearer ${token}`,
		"Cache-Control": "no-cache",
		"Host": "chat.deepseek.com",
		"Pragma": "no-cache",
		"User-Agent": "DeepSeek/2.0.4 Android/35",
		"x-client-locale": "zh_CN",
		"x-client-platform": "android",
		"x-client-timezone-offset": "28800",
		"x-client-version": "2.0.4",
	};
	if (cookies) {
		headers["Cookie"] = cookies;
	}
	return headers;
};

export const getChatHeaders = (token: string, powResponse: string, cookies?: string) => ({
	...getHistoryHeaders(token, cookies),
	"x-ds-pow-response": powResponse,
	"Content-Type": "application/json",
});
