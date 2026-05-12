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
import {
	History,
	Activity,
	Settings2,
	Code,
	ChevronRight,
} from "lucide-react";

interface AccountManagerSidarProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export default function AccountManagerSidar({
	activeTab,
	setActiveTab,
}: AccountManagerSidarProps) {
	const tabs = [
		{id: "logs", title: "Logs", icon: Activity},
		{id: "history", title: "Lịch sử", icon: History},
		{id: "tokens", title: "Token Usage", icon: Code},
		{id: "prompt", title: "System Prompt", icon: Settings2},
	];

	return (
		<Sidebar
			className='border-r border-border/50 w-64 shrink-0 h-full relative'
			collapsible='none'
		>
			<SidebarContent className='px-3 py-4'>
				<SidebarGroup>
					<SidebarGroupLabel className='px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2'>
						Quản lý tài khoản
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{tabs.map((tab) => {
								const isActive = activeTab === tab.id;
								return (
									<SidebarMenuItem key={tab.id}>
										<SidebarMenuButton
											onClick={() => setActiveTab(tab.id)}
											className={`h-10 px-3 rounded-xl transition-all duration-200 group w-full ${
												isActive ?
													"bg-primary/10 text-primary font-semibold"
												:	"hover:bg-primary/5 hover:text-primary active:scale-95 text-muted-foreground"
											}`}
										>
											<div className='flex items-center gap-3 w-full'>
												<tab.icon
													className={`w-4 h-4 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}
												/>
												<span className='text-sm'>
													{tab.title}
												</span>
												<ChevronRight
													className={`w-3 h-3 ml-auto transition-all ${
														isActive ?
															"opacity-100 translate-x-0"
														:	"opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
													}`}
												/>
											</div>
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
