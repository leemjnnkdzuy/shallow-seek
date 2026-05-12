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

interface Account {
	id: string;
	email: string;
	token: string;
}

const HomePage: React.FC = () => {
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
		if (confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
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

	useEffect(() => {
		fetchAccounts();
		window.addEventListener("focus", fetchAccounts);
		return () => window.removeEventListener("focus", fetchAccounts);
	}, []);

	return (
		<div className='flex flex-col h-full bg-background transition-colors duration-300'>
			{/* Header / Top Bar */}
			<header className='flex items-center justify-between px-6 py-4'>
				<div className='flex items-center gap-4'>
					<Button
						variant='default'
						size='sm'
						className='flex items-center gap-2 h-9'
						onClick={() =>
							window.electron?.windowControls.openAddAccount()
						}
					>
						<Plus className='w-4 h-4' />
						Thêm tài khoản
					</Button>
				</div>

				<div className='flex items-center gap-2'>
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
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{accounts.map((account) => (
							<Card
								key={account.id}
								className='group hover:border-primary transition-all duration-200 shadow-sm'
							>
								<CardHeader className='pb-2'>
									<div className='flex items-start justify-between'>
										<div className='flex items-center gap-3'>
											<div className='p-2 bg-primary/10 rounded-lg text-primary'>
												<User className='w-5 h-5' />
											</div>
											<div>
												<CardTitle className='text-base truncate max-w-[180px]'>
													{account.email}
												</CardTitle>
												<CardDescription className='text-xs mt-0.5'>
													ID: {account.id.slice(0, 8)}
													...
												</CardDescription>
											</div>
										</div>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity'
											onClick={() =>
												handleDeleteAccount(account.id)
											}
										>
											<Trash2 className='w-4 h-4' />
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									<div className='flex items-center justify-between'>
										<Badge
											variant='secondary'
											className='font-normal text-[10px] h-5'
										>
											Sẵn sàng
										</Badge>
										<Button
											variant='link'
											className='h-auto p-0 text-primary text-xs flex items-center gap-1'
										>
											Sử dụng{" "}
											<ChevronRight className='w-3 h-3' />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				:	<div className='h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6'>
						<img
							src={logo}
							alt='Logo'
							className='w-20 h-20 object-contain'
						/>
						<div className='space-y-2'>
							<h1 className='text-3xl font-bold tracking-tight text-primary'>
								Cảnh báo & Miễn trừ trách nhiệm
							</h1>
							<p className='text-muted-foreground'>
								DeepSeek là dịch vụ của bên thứ ba. Việc sử dụng
								ShallowSeek có thể tiềm ẩn rủi ro cho tài khoản
								của bạn. Vui lòng đọc kỹ các điều khoản và quy
								định trước khi bắt đầu.
							</p>
						</div>
						<Button
							variant='default'
							size='lg'
							className='rounded-full px-8 font-semibold shadow-lg shadow-primary/20'
							onClick={() => (window.location.hash = "/warning")}
						>
							<ShieldAlert className='w-5 h-5 mr-2' />
							Xem cảnh báo rủi ro
						</Button>
					</div>
				}
			</main>
		</div>
	);
};

export default HomePage;
