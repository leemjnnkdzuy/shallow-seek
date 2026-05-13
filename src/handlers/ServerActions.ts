export async function toggleServer(isRunning: boolean) {
	if (isRunning) {
		await window.electron?.server?.stop();
	} else {
		await window.electron?.server?.start();
	}
}

export async function restartServer(isRunning: boolean) {
	if (isRunning) {
		await window.electron?.server?.stop();
		return new Promise<void>((resolve) => {
			setTimeout(async () => {
				await window.electron?.server?.start();
				resolve();
			}, 500);
		});
	}
}
