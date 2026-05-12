import React from "react";

// Layouts
import NothingLayout from "@/components/layouts/NothingLayout";
// import SidebarLayout from "@/components/layouts/SidebarLayout";

// Pages
import HomePage from "@/windows/main/HomePage";
import AddAccountPage from "@/windows/popup/AddAccountPage";
import WarningPage from "@/windows/main/WarningPage";
import ConfirmPage from "@/windows/popup/ConfirmPage";
import EndpointPage from "@/windows/setting/EndpointPage";
import InterfacePage from "@/windows/setting/InterfacePage";
import SidebarLayout from "@/components/layouts/SidebarLayout";

export interface RouteConfig {
	path: string;
	component: React.ComponentType<any>;
	layout: React.ComponentType<{children: React.ReactNode}>;
}

const routes: RouteConfig[] = [
	{
		path: "/",
		component: HomePage,
		layout: NothingLayout,
	},
	{
		path: "/warning",
		component: WarningPage,
		layout: NothingLayout,
	},
	{
		path: "/settings/endpoint",
		component: EndpointPage,
		layout: SidebarLayout,
	},
	{
		path: "/settings/interface",
		component: InterfacePage,
		layout: SidebarLayout,
	},
	{
		path: "/add-account",
		component: AddAccountPage,
		layout: NothingLayout,
	},
	{
		path: "/confirm",
		component: ConfirmPage,
		layout: NothingLayout,
	},
];

export default routes;
