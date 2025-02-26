import AppSidebar from "@/components/sidebar/app-sidebar"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Visitstable from "@/components/visits/outpatientvisit";
import Inpatientvisits from "@/components/visits/inpatientvisit";


const Patients = () => {
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
            <Inpatientvisits/>
        </SidebarInset>
      </SidebarProvider>
    );
}

export default Patients;