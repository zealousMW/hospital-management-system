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
        <SidebarTrigger />
            <PatientTable />
        </SidebarInset>
      </SidebarProvider>
    );
}

export default Patients;