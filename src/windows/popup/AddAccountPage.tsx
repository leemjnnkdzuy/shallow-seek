import React, {useEffect, useState} from "react";

import {Button} from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useTitleBar} from "@/hooks/useTitleBar";
import {getShumeiDeviceId} from "@/services/DeepseekDevice";
import {
	CheckCircle,
	Eye,
	EyeOff,
	Info,
	Key,
	Loader2,
	User,
	XCircle,
} from "lucide-react";

import {AnimatePresence, motion} from "framer-motion";

import {DEEPSEEK_LOGIN_URL} from "@/constants/DeepseekURL";
import {maskIdentifier, previewValue} from "@/lib/utils";

type DeepseekLoginResponse = {
	code?: number;
	msg?: string;
	data?: {
		biz_code?: number;
		biz_msg?: string;
		biz_data?: {
			user?: {
				id: string;
				email: string;
				token: string;
			};
		};
	};
};

const phaseVariants = {
	initial: {opacity: 0, y: 8, scale: 0.995},
	animate: {opacity: 1, y: 0, scale: 1, transition: {duration: 0.28}},
	exit: {opacity: 0, y: -8, scale: 0.995, transition: {duration: 0.18}},
};


const buildLoginErrorLog = (params: {
	err: unknown;
	email: string;
	deviceId: string;
}) => {
	const {err, email, deviceId} = params;
	return {
		at: new Date().toISOString(),
		url: DEEPSEEK_LOGIN_URL,
		emailMasked: maskIdentifier(email),
		deviceIdPrefix: deviceId ? deviceId.slice(0, 8) : "",
		deviceIdLength: deviceId.length,
		online: navigator.onLine,
		origin: window.location.origin,
		userAgent: navigator.userAgent,
		err: previewValue(err),
	};
};

const AddAccountPage: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [phase, setPhase] = useState<1 | 2>(1);
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);
	const [errorMessage, setErrorMessage] = useState("");
	const [emailExists, setEmailExists] = useState(false);
	const {setConfig, resetConfig} = useTitleBar();

	useEffect(() => {
		setConfig({
			showMinimize: false,
			showMaximize: false,
			showLogo: false,
			title: "",
		});
		return () => resetConfig();
	}, [setConfig, resetConfig]);

	const handleLogin = async () => {
		if (!username || !password) return;

		setEmailExists(false);
		setErrorMessage("");

		const check = await window.electron?.db.checkAccountExists(username.trim());
		if (check?.success && check.exists) {
			setEmailExists(true);
			setErrorMessage("Tài khoản này đã tồn tại trong hệ thống.");
			return;
		} else if (check && !check.success) {
			console.error("Failed to check account existence:", check.error);
		}

		setPhase(2);
		setStatus("loading");

		let deviceId = "";

		try {
			deviceId = await getShumeiDeviceId();

			const result = await window.electron?.deepseek?.login({
				email: username,
				password,
				deviceId,
			});

			if (!result) {
				throw new Error("Electron bridge unavailable");
			}

			if (!result.ok) {
				const logPayload = {
					...buildLoginErrorLog({
						err: result.error,
						email: username,
						deviceId,
					}),
					source: "main",
					error: result.error,
				};
				console.groupCollapsed("[DeepSeek] Login failed (main)");
				console.error(logPayload);
				console.groupEnd();
				window.electron?.log?.(logPayload);

				setStatus("error");
				setErrorMessage(
					result.error?.code ?
						`${result.error.message} (${result.error.code})`
					:	result.error?.message || "Network Error",
				);
				return;
			}

			const responseData = result.data as DeepseekLoginResponse;

			if (
				responseData &&
				responseData.code === 0 &&
				responseData.data?.biz_code === 0
			) {
				const user = responseData.data?.biz_data?.user;
				if (!user) {
					setStatus("error");
					setErrorMessage("Thiếu dữ liệu người dùng từ máy chủ.");
					return;
				}

				const res = await window.electron?.db.addAccount({
					id: user.id,
					email: user.email,
					token: user.token,
				});

				if (res?.success) {
					console.log(`[AddAccountPage] Successfully added account. Chat Token: ${user.token.substring(0, 15)}... (len: ${user.token.length}), Platform Token: ${result.platformToken ? `${result.platformToken.substring(0, 15)}... (len: ${result.platformToken.length})` : 'NULL'}`);
					
					if (result.platformToken) {
						await window.electron?.db.setSetting(
							`platform_token_${user.id}`, 
							result.platformToken
						);
					}

					setStatus("success");
					setTimeout(() => {
						window.electron?.windowControls.close();
					}, 1500);
				} else {
					setStatus("error");
					setErrorMessage("Lỗi khi lưu tài khoản vào cơ sở dữ liệu.");
				}
			} else {
				setStatus("error");
				setErrorMessage(
					responseData?.data?.biz_msg ||
						responseData?.msg ||
						(result.status ?
							`HTTP ${result.status}`
						:	"Đăng nhập thất bại."),
				);
			}
		} catch (err: unknown) {
			setStatus("error");

			const logPayload = {
				...buildLoginErrorLog({err, email: username, deviceId}),
				source: "renderer",
			};
			console.groupCollapsed("[DeepSeek] Login failed (renderer)");
			console.error(logPayload);
			console.groupEnd();
			window.electron?.log?.(logPayload);

			setErrorMessage(
				err instanceof Error ?
					err.message
				:	"Không thể kết nối đến máy chủ.",
			);
		}
	};

	return (
		<div className='min-h-full w-full flex items-center justify-center p-6'>
			<Card className='w-full max-w-md shadow-none border-none bg-transparent'>
				<AnimatePresence mode='wait'>
					{phase === 1 ?
						<motion.div
							key='phase-1'
							variants={phaseVariants}
							initial='initial'
							animate='animate'
							exit='exit'
						>
							<CardHeader className='space-y-1'>
								<CardTitle className='text-2xl font-bold'>
									Thêm tài khoản DeepSeek
								</CardTitle>
								<CardDescription>
									Nhập thông tin tài khoản và mật khẩu để bắt
									đầu sử dụng ShallowSeek.
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='username'>Tài khoản</Label>
									<div className='relative'>
										<User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
										<Input
											id='username'
											placeholder='Nhập tên tài khoản...'
											className={`pl-9 ${emailExists ? "border-destructive focus-visible:ring-destructive" : ""}`}
											value={username}
											onChange={(e) => {
												setUsername(e.target.value);
												if (emailExists)
													setEmailExists(false);
											}}
										/>
									</div>
									{emailExists && (
										<p className='text-[11px] text-destructive font-medium mt-1 flex items-center gap-1'>
											<XCircle className='w-3 h-3' />
											Tài khoản đã tồn tại.
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='password'>Mật khẩu</Label>
									<div className='relative'>
										<Key className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
										<Input
											id='password'
											type={
												showPassword ? "text" : (
													"password"
												)
											}
											placeholder='Nhập mật khẩu...'
											className='pl-9 pr-10'
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
										/>
										<button
											type='button'
											onClick={() =>
												setShowPassword((v) => !v)
											}
											className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
										>
											{showPassword ?
												<EyeOff className='h-4 w-4' />
											:	<Eye className='h-4 w-4' />}
										</button>
									</div>

									<div className='text-[10px] text-muted-foreground flex items-center gap-1'>
										<Info className='w-3 h-3' />
										Mật khẩu của bạn được lưu trữ an toàn
										trên máy tính này.
									</div>
								</div>
							</CardContent>

							<CardFooter className='flex flex-col gap-3 mt-2'>
								<Button
									className='w-full h-10'
									onClick={handleLogin}
									disabled={!username || !password}
								>
									Tiếp tục
								</Button>
								<Button
									variant='ghost'
									className='w-full h-10'
									onClick={() =>
										window.electron?.windowControls.close()
									}
								>
									Hủy bỏ
								</Button>
							</CardFooter>
						</motion.div>
					:	<motion.div
							key='phase-2'
							variants={phaseVariants}
							initial='initial'
							animate='animate'
							exit='exit'
							className='flex flex-col items-center justify-center space-y-6 py-12 px-6 min-h-[350px]'
						>
							{status === "loading" && (
								<motion.div
									initial={{opacity: 0, scale: 0.8}}
									animate={{opacity: 1, scale: 1}}
									className='flex flex-col items-center space-y-4'
								>
									<Loader2 className='w-12 h-12 animate-spin text-primary' />
									<div className='text-center'>
										<h3 className='text-lg font-medium'>
											Đang kiểm tra...
										</h3>
										<p className='text-sm text-muted-foreground mt-1'>
											Vui lòng chờ trong giây lát
										</p>
									</div>
								</motion.div>
							)}

							{status === "success" && (
								<motion.div
									initial={{opacity: 0, scale: 0.8}}
									animate={{opacity: 1, scale: 1}}
									className='flex flex-col items-center space-y-4'
								>
									<div className='bg-green-500/10 p-4 rounded-full'>
										<CheckCircle className='w-12 h-12 text-green-500' />
									</div>
									<div className='text-center'>
										<h3 className='text-lg font-medium text-green-500'>
											Đăng nhập thành công!
										</h3>
										<p className='text-sm text-muted-foreground mt-1'>
											Đang quay lại trang chính...
										</p>
									</div>
								</motion.div>
							)}

							{status === "error" && (
								<motion.div
									initial={{opacity: 0, scale: 0.8}}
									animate={{opacity: 1, scale: 1}}
									className='flex flex-col items-center space-y-4'
								>
									<div className='bg-destructive/10 p-4 rounded-full'>
										<XCircle className='w-12 h-12 text-destructive' />
									</div>
									<div className='text-center'>
										<h3 className='text-lg font-medium text-destructive'>
											Đăng nhập thất bại
										</h3>
										<p className='text-sm text-muted-foreground mt-1'>
											{errorMessage}
										</p>
									</div>
									<Button
										variant='outline'
										className='mt-4 w-32'
										onClick={() => setPhase(1)}
									>
										Thử lại
									</Button>
								</motion.div>
							)}
						</motion.div>
					}
				</AnimatePresence>
			</Card>
		</div>
	);
};

export default AddAccountPage;
