export {};

declare global {
	interface Window {
		electron?: {
			send: (channel: string, data: any) => void;
			receive: (channel: string, func: (...args: any[]) => void) => void;
			windowControls: {
				minimize: () => void;
				maximize: () => void;
				close: () => void;
				zoomIn: () => void;
				zoomOut: () => void;
				resetZoom: () => void;
				onWindowStateChange: (
					callback: (state: "maximized" | "unmaximized") => void,
				) => void;
				openAddAccount: () => void;
			};
			db: {
				addAccount: (account: {
					id: string;
					email: string;
					token: string;
				}) => Promise<{success: boolean; error?: string}>;
				getAccounts: () => Promise<{
					success: boolean;
					data?: {id: string; email: string; token: string}[];
					error?: string;
				}>;
				deleteAccount: (
					id: string,
				) => Promise<{success: boolean; error?: string}>;
				checkAccountExists: (
					email: string,
				) => Promise<{success: boolean; exists: boolean; error?: string}>;
			};
			deepseek?: {
				login: (payload: {
					email: string;
					password: string;
					deviceId: string;
				}) => Promise<{
					ok: boolean;
					status?: number;
					data?: unknown;
					error?: {
						message: string;
						code?: string;
						status?: number;
						dataPreview?: string;
					};
				}>;
			};
			log?: (payload: unknown) => void;
		};
	}
}
