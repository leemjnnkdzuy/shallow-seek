import {registerWindowIpcs} from "./Window";
import {registerAccountIpcs} from "./Account";
import {registerDatabaseIpcs} from "./Database";
import {registerServerIpcs} from "./Server";

export function registerIpcs(
	__dirname: string,
	VITE_DEV_SERVER_URL: string | undefined,
	RENDERER_DIST: string,
) {
	registerWindowIpcs(__dirname, VITE_DEV_SERVER_URL, RENDERER_DIST);
	registerAccountIpcs(__dirname, VITE_DEV_SERVER_URL, RENDERER_DIST);
	registerDatabaseIpcs();
	registerServerIpcs();
}
