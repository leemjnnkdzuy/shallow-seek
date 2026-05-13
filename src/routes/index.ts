// Layouts
import NothingLayout from "@/components/layouts/NothingLayout";
import SidebarLayout from "@/components/layouts/SidebarLayout";

// Pages
import HomePage from "@/windows/main/HomePage";
import AddAccountPage from "@/windows/popup/AddAccountPage";
import WarningPage from "@/windows/main/WarningPage";
import ConfirmPage from "@/windows/popup/ConfirmPage";
import EndpointPage from "@/windows/setting/EndpointPage";
import InterfacePage from "@/windows/setting/InterfacePage";
import AccountManagerPage from "@/windows/main/AccountManagerPage";
import CreateAPIKeyPage from "@/windows/popup/CreateAPIKeyPage";
import DeepseekBrowserPage from "@/windows/popup/DeepseekBrowserPage";

import type { RouteConfig } from "../types";

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
	{
		path: "/account/:id",
		component: AccountManagerPage,
		layout: NothingLayout,
	},
	{
		path: "/create-api-key/:token",
		component: CreateAPIKeyPage,
		layout: NothingLayout,
	},
	{
		path: "/deepseek-browser",
		component: DeepseekBrowserPage,
		layout: NothingLayout,
	},
];

export default routes;
