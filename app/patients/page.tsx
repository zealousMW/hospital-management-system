import AppSidebar from "@/components/app-sidebar"
import PatientTable from "@/components/patientinfotable";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


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
        <SidebarTrigger className="-ml-1" />
            <PatientTable />
        </SidebarInset>
      </SidebarProvider>
    );
}

export default Patients;