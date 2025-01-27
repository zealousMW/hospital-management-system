
import MedicineTable from "@/components/medicinetable";
import AppSidebar from "@/components/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


const Medicines = () => {
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
            <MedicineTable />
        </SidebarInset>
      </SidebarProvider>
    );
}

export default Medicines;