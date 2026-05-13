import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
	Plus,
	Settings,
	User,
	Trash2,
	RefreshCw,
	ChevronRight,
	ShieldAlert,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {logo} from "@/assets";
import {useLanguage} from "@/hooks/useLanguage";
import {useTitleBar} from "@/hooks/useTitleBar";

interface Account {
	id: string;
	email: string;
	chat_token: string;
	platform_token?: string;
}

const HomePage: React.FC = () => {
	const {t} = useLanguage();
	const {setConfig} = useTitleBar();
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchAccounts = async () => {
		setLoading(true);
		try {
			const res = await window.electron?.db.getAccounts();
			if (res?.success && res.data) {
				setAccounts(res.data);
			}
		} catch (error) {
			console.error("Failed to fetch accounts:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAccount = async (id: string) => {
		const confirmed = await window.electron?.windowControls.openConfirm({
			title: "",
			message: t('common.confirm_delete_account', { defaultValue: "Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác." }),
			confirmText: t('common.delete'),
			cancelText: t('common.back'),
			variant: "destructive",
			type: "danger",
			showTitle: false,
		});

		if (confirmed) {
			try {
				const res = await window.electron?.db.deleteAccount(id);
				if (res?.success) {
					fetchAccounts();
				}
			} catch (error) {
				console.error("Failed to delete account:", error);
			}
		}
	};

	const handleAddAccount = async () => {
		try {
			const result = await window.electron?.deepseek?.login({ email: "", password: "", deviceId: "" });
			if (result?.ok && result.data) {
				const user = (result.data as any)?.data?.biz_data?.user;
				if (!user) return;
				
				// check exists
				const check = await window.electron?.db.checkAccountExists(user.email);
				if (check?.success && check.exists) {
					// account already exists
					return;
				}

				const res = await window.electron?.db.addAccount({
					id: user.id,
					email: user.email,
					chat_token: user.token,
					platform_token: result.platformToken || undefined
				});

				if (res?.success) {
					fetchAccounts();
				}
			}
		} catch (error) {
			console.error("Failed to add account:", error);
		}
	};

	useEffect(() => {
		setConfig({ 
			title: t('sidebar.home'),
			showBack: false 
		});
		fetchAccounts();
		window.addEventListener("focus", fetchAccounts);
		return () => window.removeEventListener("focus", fetchAccounts);
	}, [t]);

	return (
		<div className='flex flex-col h-full bg-background transition-colors duration-300'>
			{/* Header / Top Bar */}
			<header className='flex items-center justify-between px-6 py-4'>
				<div className='flex items-center gap-4'>
					<Button
						variant='default'
						size='sm'
						className='flex items-center gap-2 h-9 px-5 rounded-xl'
						onClick={handleAddAccount}
					>
						<Plus className='w-4 h-4' />
						{t('home.add_account')}
					</Button>
				</div>

				<div className='flex items-center gap-2'>
					{accounts.length > 0 && (
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full h-9 w-9'
							onClick={() => (window.location.hash = "/warning")}
						>
							<ShieldAlert className='w-4 h-4 text-muted-foreground' />
						</Button>
					)}
					<Button
						variant='ghost'
						size='icon'
						className='rounded-full h-9 w-9'
						onClick={fetchAccounts}
						disabled={loading}
					>
						<RefreshCw
							className={`w-4 h-4 text-muted-foreground ${loading ? "animate-spin" : ""}`}
						/>
					</Button>
					<Button
						variant='ghost'
						size='icon'
						className='rounded-full h-9 w-9'
						onClick={() => window.electron?.windowControls.openSettings()}
					>
						<Settings className='w-5 h-5 text-muted-foreground' />
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<main className='flex-1 p-6 overflow-y-auto'>
				{loading && accounts.length === 0 ?
					<div className='h-full flex items-center justify-center'>
						<RefreshCw className='w-8 h-8 animate-spin text-primary' />
					</div>
				: accounts.length > 0 ?
					<div className='space-y-6'>
						<div className='flex items-center justify-between'>
							<div className='space-y-1'>
								<h2 className='text-2xl font-bold tracking-tight'>
									{t('home.added_accounts')}
								</h2>
								<p className='text-sm text-muted-foreground'>
									{t('home.active_accounts', { count: accounts.length })}
								</p>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{accounts.map((account) => (
								<Card
									key={account.id}
									className='group hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 rounded-2xl overflow-hidden'
								>
									<CardHeader className='pb-3'>
										<div className='flex items-start justify-between'>
											<div className='flex items-center gap-4'>
												<div className='p-3 bg-primary/10 rounded-xl text-primary transition-transform group-hover:scale-110 duration-300'>
													<User className='w-5 h-5' />
												</div>
												<div className='flex flex-col'>
													<CardTitle className='text-base font-bold truncate max-w-[150px]'>
														{account.email}
													</CardTitle>
													<CardDescription className='text-[10px] uppercase font-bold tracking-wider mt-1 opacity-60'>
														ID: {account.id.slice(0, 8)}
													</CardDescription>
												</div>
											</div>
											<Button
												variant='ghost'
												size='icon'
												className='h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg'
												onClick={() =>
													handleDeleteAccount(
														account.id,
													)
												}
											>
												<Trash2 className='w-4 h-4' />
											</Button>
										</div>
									</CardHeader>
									<CardContent className='pt-0'>
										<div className='flex items-center justify-between mt-2'>
											<Badge
												variant='secondary'
												className='font-bold text-[10px] h-5 px-2 rounded-md bg-green-500/10 text-green-600 border-none'
											>
												Online
											</Badge>
											<Button
												variant='link'
												className='h-auto p-0 text-primary text-xs font-bold flex items-center gap-1 group/btn'
												onClick={() => window.location.hash = `/account/${account.id}`}
											>
												{t('common.use', { defaultValue: 'Sử dụng' })}{" "}
												<ChevronRight className='w-3 h-3 transition-transform group-hover/btn:translate-x-1' />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				:	<div className='h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
						<div className='relative'>
							<div className='absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse' />
							<img
								src={logo}
								alt='Logo'
								className='w-24 h-24 object-contain relative z-10'
							/>
						</div>
						<div className='space-y-3 relative z-10'>
							<h1 className='text-3xl font-extrabold tracking-tight text-primary'>
								{t('home.warning_title')}
							</h1>
							<p className='text-muted-foreground leading-relaxed'>
								{t('home.warning_desc')}
							</p>
						</div>
						<Button
							variant='default'
							size='lg'
							className='rounded-full px-10 h-12 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95'
							onClick={() => (window.location.hash = "/warning")}
						>
							<ShieldAlert className='w-5 h-5 mr-3' />
							{t('home.view_warning')}
						</Button>
					</div>
				}
			</main>
		</div>
	);
};

export default HomePage;
