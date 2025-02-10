import DispancyPage from "@/components/dispancy/dispancypage";
import AppSidebar from "@/components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const Dispancy = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger />
        <DispancyPage />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dispancy;
