import AppSidebar from "@/components/sidebar/app-sidebar"
import PatientDetailsTable from "@/components/patients/patientdetailstable";
import PatientInformationDemo, { PatientInformation } from "@/components/patients/patientinformation";

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
            <PatientInformationDemo/>
        </SidebarInset>
      </SidebarProvider>
    );
}

export default Visits;