import {SocksProxyAgent} from "socks-proxy-agent";
import {HttpsProxyAgent} from "https-proxy-agent";

export function getProxyAgent(proxyUrl?: string | null) {
	if (!proxyUrl) return undefined;
	const trimmed = proxyUrl.trim();
	if (!trimmed) return undefined;

	if (
		trimmed.startsWith("socks5://") ||
		trimmed.startsWith("socks4://") ||
		trimmed.startsWith("socks://")
	) {
		return new SocksProxyAgent(trimmed);
	}
	if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
		return new HttpsProxyAgent(trimmed);
	}
	return undefined;
}
