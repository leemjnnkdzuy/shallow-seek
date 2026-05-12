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

const WarningPage: React.FC = () => {
	const {setConfig, resetConfig} = useTitleBar();

	useEffect(() => {
		setConfig({
			showBack: true,
			onBack: () => (window.location.hash = "/"),
			title: "Điều khoản sử dụng",
		});
		return () => resetConfig();
	}, []);

	return (
		<div className='w-full h-full min-h-screen flex flex-col items-center justify-center bg-background p-6 relative'>
			<Card className='w-full max-w-2xl border-none shadow-none bg-transparent relative overflow-visible'>
				<CardHeader className='space-y-4 pb-6'>
					<div className='flex items-center gap-3'>
						<div>
							<CardTitle className='text-2xl font-bold tracking-tight text-primary'>
								CẢNH BÁO & MIỄN TRỪ TRÁCH NHIỆM
							</CardTitle>
							<CardDescription className='text-sm font-medium mt-1'>
								Vui lòng đọc kỹ các điều khoản dưới đây trước
								khi sử dụng ShallowSeek
							</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent className='space-y-6'>
					<div className='p-4 bg-muted/50 rounded-lg border border-border/50 space-y-3 text-sm leading-relaxed'>
						<p className='font-semibold text-foreground flex items-center gap-2'>
							<ShieldAlert className='w-4 h-4 text-amber-500' />
							Mục đích sử dụng
						</p>
						<p className='text-muted-foreground'>
							Dự án <strong>ShallowSeek</strong> được xây dựng dựa
							trên phương pháp kỹ thuật đảo ngược (reverse
							engineering) giao diện web của DeepSeek. Ứng dụng
							này{" "}
							<strong>
								chỉ dành riêng cho mục đích học tập, nghiên cứu,
								thử nghiệm cá nhân và xác thực nội bộ
							</strong>
							. Chúng tôi không cung cấp bất kỳ hình thức ủy quyền
							thương mại, đảm bảo tính ổn định hay tính khả dụng
							nào đối với kết quả đầu ra.
						</p>
					</div>

					<div className='space-y-4 text-sm text-muted-foreground px-1'>
						<div className='flex gap-3'>
							<AlertCircle className='w-5 h-5 text-destructive shrink-0 mt-0.5' />
							<div className='space-y-1'>
								<h4 className='font-semibold text-foreground'>
									Rủi ro tài khoản & Dữ liệu
								</h4>
								<p>
									Tác giả và những người bảo trì kho lưu trữ
									ShallowSeek{" "}
									<strong>KHÔNG CHỊU TRÁCH NHIỆM</strong> đối
									với bất kỳ tổn thất trực tiếp hay gián tiếp
									nào phát sinh từ việc sử dụng, sửa đổi, phân
									phối, triển khai hoặc phụ thuộc vào dự án
									này. Điều này bao gồm nhưng không giới hạn
									ở:{" "}
									<strong>
										tài khoản bị khóa (ban), mất mát dữ
										liệu, rủi ro pháp lý, hoặc các khiếu nại
										từ bên thứ ba
									</strong>
									.
								</p>
							</div>
						</div>

						<div className='flex gap-3'>
							<AlertCircle className='w-5 h-5 text-destructive shrink-0 mt-0.5' />
							<div className='space-y-1'>
								<h4 className='font-semibold text-foreground'>
									Quy định về nền tảng
								</h4>
								<p>
									Tuyệt đối <strong>KHÔNG</strong> sử dụng
									ShallowSeek trong các tình huống vi phạm
									Điều khoản dịch vụ, Thỏa thuận người dùng,
									Luật pháp và quy định hiện hành hoặc quy tắc
									của các nền tảng liên quan.
								</p>
							</div>
						</div>

						<div className='flex gap-3'>
							<AlertCircle className='w-5 h-5 text-destructive shrink-0 mt-0.5' />
							<div className='space-y-1'>
								<h4 className='font-semibold text-foreground'>
									Sử dụng thương mại
								</h4>
								<p>
									Trước khi có ý định sử dụng dự án cho mục
									đích thương mại, bạn phải tự xác nhận giấy
									phép (LICENSE), các thỏa thuận liên quan và
									đảm bảo rằng bạn đã nhận được sự cho phép
									bằng văn bản từ tác giả gốc của dự án.
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
