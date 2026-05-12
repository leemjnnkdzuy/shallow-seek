import React from "react";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import SettingSidebar from "@/components/common/SettingSidebar";
import TitleBar from "@/components/common/TitleBar";

export default function SidebarLayout({children}: {children: React.ReactNode}) {
	return (
		<SidebarProvider className='h-screen w-full overflow-hidden bg-background'>
			<SettingSidebar />
			<SidebarInset className='bg-background overflow-hidden flex flex-col'>
				<TitleBar />
				<div
					id='main-scroll-container'
					className='flex-1 overflow-y-auto overflow-x-hidden w-full'
				>
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
