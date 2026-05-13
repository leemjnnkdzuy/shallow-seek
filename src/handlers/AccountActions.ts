
export async function addAccount(callbacks: {
	fetchAccounts: () => void;
}) {
	try {
		const result = await window.electron?.deepseek?.login({
			email: "",
			password: "",
			deviceId: "",
		});
		if (result?.ok && result.data) {
			const user = (result.data as any)?.data?.biz_data?.user;
			if (!user) return;

			const check = await window.electron?.db.checkAccountExists(user.email);
			if (check?.success && check.exists) {
				return;
			}

			const res = await window.electron?.db.addAccount({
				id: user.id,
				email: user.email,
				chat_token: user.token,
				platform_token: result.platformToken || undefined,
			});

			if (res?.success) {
				callbacks.fetchAccounts();
			}
		}
	} catch (error) {
		console.error("Failed to add account:", error);
	}
}

export async function deleteAccount(
	id: string,
	t: (key: string, options?: any) => string,
	callbacks: {
		fetchAccounts: () => void;
	}
) {
	const confirmed = await window.electron?.windowControls.openConfirm({
		title: "",
		message: t("common.confirm_delete_account", {
			defaultValue:
				"Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.",
		}),
		confirmText: t("common.delete"),
		cancelText: t("common.back"),
		variant: "destructive",
		type: "danger",
		showTitle: false,
	});

	if (confirmed) {
		try {
			const res = await window.electron?.db.deleteAccount(id);
			if (res?.success) {
				callbacks.fetchAccounts();
			}
		} catch (error) {
			console.error("Failed to delete account:", error);
		}
	}
}

export function copyEndpoint(
	id: string,
	port: number,
	callbacks: {
		setCopiedId: (id: string | null) => void;
	}
) {
	const endpoint = `http://localhost:${port}/v1`;
	navigator.clipboard.writeText(endpoint);
	callbacks.setCopiedId(id);
	setTimeout(() => callbacks.setCopiedId(null), 2000);
}
