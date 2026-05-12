import React, {useEffect} from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {ShieldAlert, AlertCircle} from "lucide-react";
import {useTitleBar} from "@/hooks/useTitleBar";
import {useLanguage} from "@/hooks/useLanguage";

const WarningPage: React.FC = () => {
	const {t} = useLanguage();
	const {setConfig, resetConfig} = useTitleBar();

	useEffect(() => {
		setConfig({
			showBack: true,
			onBack: () => (window.location.hash = "/"),
			title: t('common.terms_of_use', { defaultValue: "Điều khoản sử dụng" }),
		});
		return () => resetConfig();
	}, [t]);

	return (
		<div className='w-full h-full min-h-screen flex flex-col items-center justify-center bg-background p-6 relative'>
			<Card className='w-full max-w-2xl border-none shadow-none bg-transparent relative overflow-visible'>
				<CardHeader className='space-y-4 pb-6 text-center sm:text-left'>
					<div className='flex flex-col sm:flex-row items-center gap-4'>
						<div>
							<CardTitle className='text-2xl font-bold tracking-tight text-primary uppercase'>
								{t('warning.title')}
							</CardTitle>
							<CardDescription className='text-sm font-medium mt-1'>
								{t('warning.subtitle')}
							</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent className='space-y-6'>
					<div className='p-6 bg-muted/30 rounded-3xl border border-border/50 space-y-4 text-sm leading-relaxed backdrop-blur-sm'>
						<p className='font-bold text-foreground flex items-center gap-2 text-base'>
							<ShieldAlert className='w-5 h-5 text-amber-500' />
							{t('warning.purpose_title')}
						</p>
						<p className='text-muted-foreground'>
							{t('warning.purpose_desc')}
						</p>
					</div>

					<div className='grid grid-cols-1 gap-6 text-sm text-muted-foreground px-1'>
						<div className='flex gap-4 p-4 rounded-2xl hover:bg-muted/20 transition-colors'>
							<AlertCircle className='w-6 h-6 text-destructive shrink-0 mt-0.5' />
							<div className='space-y-1.5'>
								<h4 className='font-bold text-foreground text-base'>
									{t('warning.risk_title')}
								</h4>
								<p className="leading-relaxed">
									{t('warning.risk_desc')}
								</p>
							</div>
						</div>

						<div className='flex gap-4 p-4 rounded-2xl hover:bg-muted/20 transition-colors'>
							<AlertCircle className='w-6 h-6 text-destructive shrink-0 mt-0.5' />
							<div className='space-y-1.5'>
								<h4 className='font-bold text-foreground text-base'>
									{t('warning.platform_title')}
								</h4>
								<p className="leading-relaxed">
									{t('warning.platform_desc')}
								</p>
							</div>
						</div>

						<div className='flex gap-4 p-4 rounded-2xl hover:bg-muted/20 transition-colors'>
							<AlertCircle className='w-6 h-6 text-destructive shrink-0 mt-0.5' />
							<div className='space-y-1.5'>
								<h4 className='font-bold text-foreground text-base'>
									{t('warning.commercial_title')}
								</h4>
								<p className="leading-relaxed">
									{t('warning.commercial_desc')}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default WarningPage;
