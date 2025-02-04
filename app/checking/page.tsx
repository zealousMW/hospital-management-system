import CheckPage from "@/components/checking/checkpage";
import Department from "@/components/departments/Department";
import AppSidebar from "@/components/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


const Departments = () => {
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
            <CheckPage/>
        </SidebarInset>
      </SidebarProvider>
    );
}

export default Departments;