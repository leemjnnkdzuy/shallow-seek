export async function toggleServer(accountId: string, isRunning: boolean) {
	if (isRunning) {
		await window.electron?.server?.stopAccount({accountId});
	} else {
		await window.electron?.server?.startAccount({accountId});
	}
}

export async function restartServer(accountId: string, isRunning: boolean) {
	if (isRunning) {
		await window.electron?.server?.stopAccount({accountId});
		return new Promise<void>((resolve) => {
			setTimeout(async () => {
				await window.electron?.server?.startAccount({accountId});
				resolve();
			}, 500);
		});
	}
}
