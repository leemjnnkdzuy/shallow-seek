import {registerWindowIpcs} from "@/ipcs/Window";
import {registerAccountIpcs} from "@/ipcs/Account";
import {registerDatabaseIpcs} from "@/ipcs/Database";
import {registerServerIpcs} from "@/ipcs/Server";

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
