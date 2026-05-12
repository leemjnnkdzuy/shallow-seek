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

export const getPlatformHeaders = (token: string) => ({
	"accept": "*/*",
	"accept-language": "vi,vi-VN;q=0.9,en;q=0.8",
	"authorization": `Bearer ${token}`,
	"cache-control": "no-cache",
	"pragma": "no-cache",
	"sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
	"sec-ch-ua-mobile": "?0",
	"sec-ch-ua-platform": "\"Windows\"",
	"sec-fetch-dest": "empty",
	"sec-fetch-mode": "cors",
	"sec-fetch-site": "same-origin",
	"x-app-version": "1.0.0",
	"Referer": "https://platform.deepseek.com/api_keys",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
});

export const getPlatformLoginHeaders = () => ({
	"accept": "*/*",
	"accept-language": "vi,vi-VN;q=0.9,en;q=0.8",
	"cache-control": "no-cache",
	"content-type": "application/json",
	"pragma": "no-cache",
	"sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
	"sec-ch-ua-mobile": "?0",
	"sec-ch-ua-platform": "\"Windows\"",
	"sec-fetch-dest": "empty",
	"sec-fetch-mode": "cors",
	"sec-fetch-site": "same-origin",
	"x-app-version": "1.0.0",
	"Referer": "https://platform.deepseek.com/sign_in",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
});
