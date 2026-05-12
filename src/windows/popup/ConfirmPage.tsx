import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {HelpCircle, Trash2, ShieldAlert, CheckCircle2} from "lucide-react";
import {useTitleBar} from "@/hooks/useTitleBar";
import {motion} from "framer-motion";

const ConfirmPage: React.FC = () => {
	const {setConfig, resetConfig} = useTitleBar();
	const [config, setPageConfig] = useState({
		title: "Xác nhận",
		message: "Bạn có chắc chắn muốn thực hiện hành động này?",
		confirmText: "Xác nhận",
		cancelText: "Hủy bỏ",
		variant: "default" as "default" | "destructive" | "warning",
		type: "question" as "question" | "danger" | "warning" | "success",
		showTitle: false,
	});

	useEffect(() => {
		const hash = window.location.hash;
		const searchParams = new URLSearchParams(hash.split("?")[1]);
		
		const title = searchParams.get("title") || "Xác nhận";
		const message = searchParams.get("message") || "Bạn có chắc chắn muốn thực hiện hành động này?";
		const confirmText = searchParams.get("confirmText") || "Xác nhận";
		const cancelText = searchParams.get("cancelText") || "Hủy bỏ";
		const variant = (searchParams.get("variant") as any) || "default";
		const type = (searchParams.get("type") as any) || "question";
		const showTitle = searchParams.get("showTitle") !== "false";

		setPageConfig({title, message, confirmText, cancelText, variant, type, showTitle});

		setConfig({
			showMinimize: false,
			showMaximize: false,
			showClose: true,
			showLogo: false,
			title: showTitle ? title : "",
		});
		return () => resetConfig();
	}, []);

	const handleConfirm = () => {
		window.electron?.windowControls.confirmResult(true);
	};

	const handleCancel = () => {
		window.electron?.windowControls.confirmResult(false);
	};

	const getIcon = () => {
		switch (config.type) {
			case "danger":
				return <Trash2 className='w-12 h-12 text-destructive' />;
			case "warning":
				return <ShieldAlert className='w-12 h-12 text-amber-500' />;
			case "success":
				return <CheckCircle2 className='w-12 h-12 text-green-500' />;
			case "question":
			default:
				return <HelpCircle className='w-12 h-12 text-primary' />;
		}
	};

	return (
		<div className='w-full h-full bg-background flex items-center justify-center p-6 overflow-hidden'>
			<motion.div 
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				className='w-full flex items-start gap-5'
			>
				{/* Left side: Icon */}
				<div className={`p-4 rounded-2xl flex-shrink-0 ${
					config.type === 'danger' ? 'bg-destructive/10' : 
					config.type === 'warning' ? 'bg-amber-500/10' :
					config.type === 'success' ? 'bg-green-500/10' : 'bg-primary/10'
				}`}>
					{getIcon()}
				</div>

				{/* Right side: Content */}
				<div className='flex-1 flex flex-col h-full min-h-[120px]'>
					<div className='space-y-1.5 flex-1'>
						{config.showTitle && (
							<h2 className='text-lg font-bold tracking-tight'>{config.title}</h2>
						)}
						<p className='text-sm text-muted-foreground leading-relaxed'>
							{config.message}
						</p>
					</div>

					<div className='flex items-center gap-3 w-full pt-6 justify-end'>
						<Button
							variant='ghost'
							className='px-6 h-10 font-medium rounded-xl transition-all'
							onClick={handleCancel}
						>
							{config.cancelText}
						</Button>
						<Button
							variant={config.variant === 'destructive' ? 'destructive' : 'default'}
							className={`px-8 h-10 font-semibold rounded-full shadow-lg transition-all ${
								config.variant === 'default' ? 'shadow-primary/20' : 
								config.variant === 'destructive' ? 'shadow-destructive/20' : ''
							}`}
							onClick={handleConfirm}
						>
							{config.confirmText}
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default ConfirmPage;
