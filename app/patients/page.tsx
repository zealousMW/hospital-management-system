import AppSidebar from "@/components/sidebar/app-sidebar"
import PatientDetailsTable from "@/components/patients/patientdetailstable";

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