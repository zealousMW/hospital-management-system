import AppSidebar from "@/components/app-sidebar"
import PatientDetailsTable from "@/components/patientdetailstable";

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
            <PatientDetailsTable/>
        </SidebarInset>
      </SidebarProvider>
    );
}

export default Visits;