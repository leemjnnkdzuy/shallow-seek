import React from "react";
import {useTheme} from "@/hooks/useTheme";
import {useLanguage} from "@/hooks/useLanguage";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {Sun, Moon, Monitor, Check} from "lucide-react";
import {cn} from "@/lib/utils";

const InterfacePage: React.FC = () => {
	const {theme, setTheme} = useTheme();
	const {currentLanguage, changeLanguage, t} = useLanguage();

	const themes = [
		{id: "light", label: t("settings.theme_light"), icon: Sun},
		{id: "dark", label: t("settings.theme_dark"), icon: Moon},
		{id: "system", label: t("settings.theme_system"), icon: Monitor},
	];

	const languages = [
		{id: "en", label: t("settings.lang_en")},
		{id: "vi", label: t("settings.lang_vi")},
		{id: "zh", label: t("settings.lang_zh")},
	];

	return (
		<div className='p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-extrabold tracking-tight text-primary'>
					{t("settings.interface_title")}
				</h1>
				<p className='text-muted-foreground'>
					{t("settings.interface_desc")}
				</p>
			</div>

			{/* Theme Selection */}
			<div className='space-y-6'>
				<div className='space-y-1'>
					<h2 className='text-xl font-bold tracking-tight'>
						{t("settings.theme_title")}
					</h2>
					<p className='text-sm text-muted-foreground'>
						{t("settings.theme_desc")}
					</p>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
					{themes.map((item) => (
						<button
							key={item.id}
							onClick={() =>
								setTheme(item.id as "light" | "dark" | "system")
							}
							className={cn(
								"relative flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 group bg-transparent",
								theme === item.id ?
									"border-primary ring-4 ring-primary/10"
								:	"border-border hover:border-primary/50 hover:bg-muted/50",
							)}
						>
							<item.icon
								className={cn(
									"w-6 h-6 transition-transform duration-300 group-hover:scale-110",
									theme === item.id ?
										"text-primary"
									:	"text-muted-foreground",
								)}
							/>
							<span
								className={cn(
									"font-bold text-sm",
									theme === item.id ?
										"text-primary"
									:	"text-muted-foreground",
								)}
							>
								{item.label}
							</span>
							{theme === item.id && (
								<div className='absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg'>
									<Check className='w-3 h-3' />
								</div>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Language Selection */}
			<div className='flex items-center justify-between gap-8 py-2'>
				<div className='space-y-1'>
					<h2 className='text-xl font-bold tracking-tight'>
						{t("settings.lang_title")}
					</h2>
					<p className='text-sm text-muted-foreground'>
						{t("settings.lang_desc", {
							defaultValue:
								"Chọn ngôn ngữ hiển thị cho ứng dụng.",
						})}
					</p>
				</div>
				<div className='w-48 shrink-0'>
					<Select
						value={currentLanguage}
						onValueChange={(val) => changeLanguage(val)}
					>
						<SelectTrigger className='h-12 rounded-xl border-2 border-border bg-transparent focus:ring-primary/20 transition-all font-bold'>
							<SelectValue
								placeholder={t("settings.lang_placeholder", {
									defaultValue: "Chọn ngôn ngữ",
								})}
							/>
						</SelectTrigger>
						<SelectContent className='rounded-xl border-border bg-background/95 backdrop-blur-xl'>
							{languages.map((lang) => (
								<SelectItem
									key={lang.id}
									value={lang.id}
									className='rounded-lg focus:bg-primary/10 focus:text-primary transition-colors font-medium py-3'
								>
									{lang.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
};

export default InterfacePage;
