import {registerWindowIpcs} from "./window";
import {registerAccountIpcs} from "./account";
import {registerDatabaseIpcs} from "./database";

export function registerIpcs(
	__dirname: string,
	VITE_DEV_SERVER_URL: string | undefined,
	RENDERER_DIST: string,
) {
	registerWindowIpcs();
	registerAccountIpcs(__dirname, VITE_DEV_SERVER_URL, RENDERER_DIST);
	registerDatabaseIpcs();
}
