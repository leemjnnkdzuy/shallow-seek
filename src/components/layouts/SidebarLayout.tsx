import React from "react";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import GlobalSidebar from "@/components/common/GlobalSidebar";
import TitleBar from "@/components/common/TitleBar";

export default function SidebarLayout({children}: {children: React.ReactNode}) {
	return (
		<div className="h-screen w-full flex flex-col overflow-hidden bg-background">
			<TitleBar />
			<div className="flex-1 overflow-hidden">
				<SidebarProvider className='h-full overflow-hidden'>
					<GlobalSidebar />
					<SidebarInset className='bg-background overflow-x-hidden'>
						<div
							id='main-scroll-container'
							className='h-full overflow-y-auto overflow-x-hidden w-full pt-6'
						>
							{children}
						</div>
					</SidebarInset>
				</SidebarProvider>
			</div>
		</div>
	);
}
