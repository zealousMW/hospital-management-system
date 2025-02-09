import AppSidebar from "@/components/sidebar/app-sidebar"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Visitstable from "@/components/visits/inpatientvisits";
import Inpatientvisits from "@/components/visits/outpatientvisits";


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