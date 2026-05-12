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
	"x-app-version": "2.0.4",
	"x-client-locale": "zh_CN",
	"x-client-platform": "android",
	"x-client-timezone-offset": "28800",
	"x-client-version": "2.0.4",
});
