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
import { Globe, Palette, ChevronRight} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function SettingSidebar() {
  const { t } = useLanguage();

  const settingItems = [
    {
      title: t('sidebar.endpoint'),
      icon: Globe,
      url: "#/settings/endpoint",
    },
    {
      title: t('sidebar.interface'),
      icon: Palette,
      url: "#/settings/interface",
    },
  ];

  return (
    <Sidebar className="border-r border-border/50"> 
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
            {t('sidebar.settings')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 px-3 rounded-xl transition-all duration-200 hover:bg-primary/5 hover:text-primary active:scale-95 group">
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span className="font-medium text-sm">{item.title}</span>
                      <ChevronRight className="w-3 h-3 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
