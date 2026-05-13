export const loginPollerScript = `
(function() {
	if (window.__loginPoller) return;
	window.__loginPoller = setInterval(() => {
		try {
			if (window.location.pathname.includes('sign_in')) return;
			const storageStr = window.localStorage.getItem('userToken');
			if (storageStr) {
				const tokenData = JSON.parse(storageStr);
				const token = tokenData.value || storageStr;
				if (token && token.length > 20) {
					console.log("__PLATFORM_TOKEN__:" + token);
				}
			}
		} catch(e) {}
	}, 1000);
})();
`;
