import React from "react";
import TitleBar from "@/components/common/TitleBar";

export default function NothingLayout({children}: {children: React.ReactNode}) {
	return (
		<div className='h-screen w-full flex flex-col overflow-hidden bg-background'>
			<TitleBar />
			<div className='flex-1 overflow-y-auto overflow-x-hidden'>
				{children}
			</div>
		</div>
	);
}
