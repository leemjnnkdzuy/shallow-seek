export interface WindowControlsAPI {
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
	openCreateApiKey: (token: string) => void;
	openSettings: () => void;
	notifyThemeChanged: (theme: string) => void;
	onThemeChanged: (callback: (theme: string) => void) => () => void;
	notifyLanguageChanged: (lang: string) => void;
	onLanguageChanged: (callback: (lang: string) => void) => () => void;
	openConfirm: (options: {
		title?: string;
		message?: string;
		confirmText?: string;
		cancelText?: string;
		variant?: "default" | "destructive" | "warning";
		type?: "question" | "danger" | "warning" | "success";
		showTitle?: boolean;
	}) => Promise<boolean>;
	confirmResult: (result: boolean) => void;
	openExternal: (url: string) => void;
}
