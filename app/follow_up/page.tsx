import AppSidebar from "@/components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import FollowUpC from "@/components/visits/followup";
import { Suspense } from "react";

const FollowUp = () => {
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
          <FollowUpC />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default FollowUp;
