import React from "react";

export interface RouteConfig {
	path: string;
	component: React.ComponentType<any>;
	layout: React.ComponentType<{ children: React.ReactNode }>;
}
