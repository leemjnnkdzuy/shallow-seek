export const getAutoLoginScript = (email: string, password: string): string => `
(function() {
	if (window.__autologinRun) return;
	window.__autologinRun = true;
	
	const email = ${JSON.stringify(email)};
	const password = ${JSON.stringify(password)};
	if (!email || !password) return;
	
	const tryLogin = () => {
		const inputs = Array.from(document.querySelectorAll('input'));
		if (inputs.length === 0) return false;
		
		const emailInput = inputs.find(i => {
			const type = i.type || 'text';
			const placeholder = (i.placeholder || '').toLowerCase();
			return (type === 'text' || type === 'email' || type === 'tel') && 
				   (placeholder.includes('phone') || placeholder.includes('email') || placeholder.includes('username') || placeholder.includes('sđt') || placeholder.includes('address') || placeholder.includes('tài khoản'));
		}) || inputs[0];
		
		const passwordInput = inputs.find(i => i.type === 'password') || inputs[1];
		
		if (emailInput && passwordInput) {
			// Use React-safe native value setter
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
			
			if (nativeInputValueSetter) {
				nativeInputValueSetter.call(emailInput, email);
				emailInput.dispatchEvent(new Event('input', { bubbles: true }));
				emailInput.dispatchEvent(new Event('change', { bubbles: true }));
				
				nativeInputValueSetter.call(passwordInput, password);
				passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
				passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
			} else {
				emailInput.value = email;
				emailInput.dispatchEvent(new Event('input', { bubbles: true }));
				passwordInput.value = password;
				passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
			
			const btn = document.querySelector('button[type="submit"]') || 
						Array.from(document.querySelectorAll('button')).find(b => {
							const text = b.textContent || "";
							return text.includes("Log in") || text.includes("Sign in") || text.includes("Đăng nhập") || text.includes("Tiếp tục") || text.includes("Continue");
						});
						
			if (btn) {
				setTimeout(() => {
					btn.click();
				}, 500);
				return true;
			}
		} else {
			const loginTrigger = Array.from(document.querySelectorAll('button, a, div')).find(el => {
				const text = el.textContent || "";
				return (text === "Log In" || text === "Đăng nhập" || text.includes("Log in") || text.includes("Sign in")) && el.offsetWidth > 0;
			});
			if (loginTrigger) {
				loginTrigger.click();
			}
		}
		return false;
	};
	
	const interval = setInterval(() => {
		if (tryLogin()) {
			clearInterval(interval);
		}
	}, 1000);
	
	setTimeout(() => clearInterval(interval), 15000);
})();
`;
