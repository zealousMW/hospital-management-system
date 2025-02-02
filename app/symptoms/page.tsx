import Screening from "@/components/screening/screening";
import AppSidebar from "@/components/sidebar/app-sidebar"


import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


const Visits = () => {
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
            <Screening />
        </SidebarInset>
      </SidebarProvider>
    );
}

export default Visits;