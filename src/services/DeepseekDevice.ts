type Smsdk = {
	ready: (callback: () => void) => void;
	getDeviceId?: () => string;
};

declare global {
	interface Window {
		SMSdk?: Smsdk;
		_smReadyFuncs?: Array<() => void>;
	}
}

const SHUMEI_SCRIPT_URL = "https://cdn.deepseek.com/static/chat/fp-1.min.js";
const SHUMEI_SCRIPT_ATTR = "data-fp";

let shumeiLoadPromise: Promise<void> | null = null;

const ensureSmsdkStub = () => {
	if (window.SMSdk) return;

	const readyCallbacks: Array<() => void> = [];
	window._smReadyFuncs = readyCallbacks;
	window.SMSdk = {
		ready: (callback) => {
			if (callback) {
				readyCallbacks.push(callback);
			}
		},
	};
};

const loadShumeiScript = () => {
	if (document.querySelector(`script[${SHUMEI_SCRIPT_ATTR}]`)) {
		return Promise.resolve();
	}

	ensureSmsdkStub();

	if (shumeiLoadPromise) {
		return shumeiLoadPromise;
	}

	shumeiLoadPromise = new Promise<void>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = SHUMEI_SCRIPT_URL;
		script.async = true;
		script.defer = true;
		script.setAttribute(SHUMEI_SCRIPT_ATTR, "true");
		script.onload = () => resolve();
		script.onerror = (event) => {
			shumeiLoadPromise = null;
			reject(event);
		};
		document.head.appendChild(script);
	});

	return shumeiLoadPromise;
};

const waitForShumeiReady = (timeoutMs: number) =>
	new Promise<void>((resolve) => {
		let done = false;
		const timer = window.setTimeout(() => {
			if (!done) {
				resolve();
			}
		}, timeoutMs);

		if (!window.SMSdk?.ready) {
			window.clearTimeout(timer);
			resolve();
			return;
		}

		window.SMSdk.ready(() => {
			if (done) return;
			done = true;
			window.clearTimeout(timer);
			resolve();
		});
	});

export const getShumeiDeviceId = async (): Promise<string> => {
	try {
		await loadShumeiScript();
		await waitForShumeiReady(1500);
		return window.SMSdk?.getDeviceId?.() ?? "";
	} catch {
		return "";
	}
};
