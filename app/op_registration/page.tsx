import AppSidebar from "@/components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Visitstable from "@/components/visits/outpatientvisit";

const Patients = () => {
  return (
    //   <SidebarProvider
    //   style={
    //     {
    //       "--sidebar-width": "19rem",
    //     } as React.CSSProperties
    //   }
    // >
    //   <AppSidebar />
    //   <SidebarInset>
    //   <SidebarTrigger />
    //       <Visitstable/>
    //   </SidebarInset>
    // </SidebarProvider>
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      {/* Sidebar Component */}
      <AppSidebar />

      {/* Main Content Area with Sidebar Inset */}
      <SidebarInset>
        {/* Sidebar Trigger for Collapsing/Expanding */}
        <SidebarTrigger />

        {/* Main Content - Visitstable */}
        <div className="p-4">
          <Visitstable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Patients;
