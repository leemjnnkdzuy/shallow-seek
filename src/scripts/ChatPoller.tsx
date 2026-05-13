export const chatPollerScript = `
(function() {
	if (window.__chatPoller) return;
	window.__chatPoller = setInterval(() => {
		try {
			if (window.location.pathname.includes('sign_in')) return;
			const storageStr = window.localStorage.getItem('userToken');
			if (storageStr) {
				const tokenData = JSON.parse(storageStr);
				const token = tokenData.value || storageStr;
				if (token && token.length > 20) {
					console.log("__CHAT_TOKEN__:" + token);
				}
			}
		} catch(e) {}
	}, 1000);
})();
`;
