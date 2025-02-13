import CheckPage from "@/components/checking/checkpage";
import Department from "@/components/departments/Department";
import AppSidebar from "@/components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Suspense } from "react";

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
        <Suspense fallback={<div>Loading...</div>}>
          <CheckPage />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Departments;
