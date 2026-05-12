import { useState, useEffect } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Globe, Palette, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function SettingSidebar() {
	const { t } = useLanguage();
	const [currentHash, setCurrentHash] = useState(() => window.location.hash || "");

	useEffect(() => {
		const handleHash = () => {
			setCurrentHash(window.location.hash || "");
		};
		window.addEventListener("hashchange", handleHash);
		return () => window.removeEventListener("hashchange", handleHash);
	}, []);

	const settingItems = [
		{
			id: "endpoint",
			title: t("sidebar.endpoint"),
			icon: Globe,
			url: "#/settings/endpoint",
		},
		{
			id: "interface",
			title: t("sidebar.interface"),
			icon: Palette,
			url: "#/settings/interface",
		},
	];

	return (
		<Sidebar
			className="border-r border-border/50 w-64 shrink-0 h-full relative"
			collapsible="none"
		>
			<SidebarContent className="px-3 py-4">
				<SidebarGroup>
					<SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
						{t("sidebar.settings")}
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{settingItems.map((item) => {
								const isActive = currentHash === item.url;
								return (
									<SidebarMenuItem key={item.id}>
										<SidebarMenuButton
											asChild
											className={`h-10 px-3 rounded-xl transition-all duration-200 group w-full ${
												isActive
													? "bg-primary/10 text-primary font-semibold"
													: "hover:bg-primary/5 hover:text-primary active:scale-95 text-muted-foreground"
											}`}
										>
											<a href={item.url} className="flex items-center gap-3 w-full">
												<item.icon
													className={`w-4 h-4 transition-transform ${
														isActive ? "scale-110" : "group-hover:scale-110"
													}`}
												/>
												<span className="text-sm">
													{item.title}
												</span>
												<ChevronRight
													className={`w-3 h-3 ml-auto transition-all ${
														isActive
															? "opacity-100 translate-x-0"
															: "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
													}`}
												/>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
