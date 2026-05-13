import React, {useState, useEffect, useCallback} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {useLanguage} from "@/hooks/useLanguage";
import {Globe, Save} from "lucide-react";
import {useTitleBar} from "@/hooks/useTitleBar";

const EndpointPage: React.FC = () => {
	const {t} = useLanguage();
	const {setConfig} = useTitleBar();
	const [port, setPort] = useState("11434");
	const [runningCount, setRunningCount] = useState(0);

	useEffect(() => {
		setConfig({title: t("sidebar.endpoint")});
	}, [t]);

	useEffect(() => {
		window.electron?.db.getSetting("endpointPort").then((res) => {
			if (res.success && res.value) {
				setPort(res.value);
			}
		});
		// Check how many accounts are currently running
		window.electron?.server.getAllRunning().then((running) => {
			if (running) {
				setRunningCount(Object.keys(running).length);
			}
		});
	}, []);

	useEffect(() => {
		const cleanup = window.electron?.server.onAccountStatusChanged(
			() => {
				// Re-check the count when any account status changes
				window.electron?.server.getAllRunning().then((running) => {
					if (running) {
						setRunningCount(Object.keys(running).length);
					} else {
						setRunningCount(0);
					}
				});
			},
		);
		return cleanup;
	}, []);

	const handleSave = useCallback(async () => {
		await window.electron?.db.setSetting("endpointPort", port);
	}, [port]);

	const hasRunning = runningCount > 0;

	return (
		<div className='p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-extrabold tracking-tight text-primary'>
					{t("settings.endpoint_title")}
				</h1>
				<p className='text-muted-foreground'>
					{t("settings.endpoint_desc")}
				</p>
			</div>

			<div className='space-y-8'>
				<div className='space-y-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-primary/10 rounded-xl text-primary'>
							<Globe className='w-5 h-5' />
						</div>
						<div>
							<h2 className='text-xl font-bold tracking-tight'>
								{t("sidebar.endpoint")}
							</h2>
							<p className='text-sm text-muted-foreground'>
								{t("settings.endpoint_desc")}
							</p>
						</div>
					</div>

					<div className='space-y-3 pl-1'>
						<Label
							htmlFor='port'
							className='text-sm font-bold ml-1'
						>
							{t("settings.port_label")}
						</Label>
						<div className='flex gap-3'>
							<Input
								id='port'
								value={port}
								onChange={(e) => setPort(e.target.value)}
								placeholder={t("settings.port_placeholder")}
								disabled={hasRunning}
								className='max-w-[240px] h-12 rounded-xl border-2 border-border bg-transparent focus-visible:ring-primary/20 font-bold disabled:opacity-50'
							/>
							<Button
								onClick={handleSave}
								disabled={hasRunning}
								className='h-12 px-6 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50'
							>
								<Save className='w-4 h-4' />
								{t("common.save")}
							</Button>
						</div>
						{hasRunning && (
							<p className='text-xs text-amber-500 ml-1'>
								Không thể thay đổi port khi có {runningCount} server đang chạy. Dừng tất cả server trước.
							</p>
						)}
					</div>
				</div>

				<div className='pt-8 border-t border-border/50 flex items-center justify-between'>
					<div className='space-y-1 pl-1'>
						<Label className='text-lg font-bold'>
							{t("settings.status")}
						</Label>
						<p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
							<span
								className={`w-2 h-2 rounded-full ${hasRunning ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"}`}
							/>
							{hasRunning
								? `${runningCount} server(s) đang chạy`
								: t("settings.inactive")}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EndpointPage;
