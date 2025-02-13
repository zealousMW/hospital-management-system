import {
  Users,
  Building2,
  Bed,
  ClipboardList,
  Pill,
  Activity,
  FileText,
  Syringe,
  ArrowRightLeft,
  LayoutDashboard,
  Calendar, // Add this import
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Avatar from ShadCN UI
import { Button } from "@/components/ui/button"; // Button from ShadCN UI
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const menuGroups = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Patient Care",
    items: [
      {
        title: "Patients",
        url: "/patients",
        icon: Users,
      },
      {
        title: "Outpatients Registration",
        url: "/op_registration",
        icon: ClipboardList,
      },
      {
        title: "InPatient Registration",
        url: "/ip_registration",
        icon: Bed, // Changed from Activity to Bed
      },
      {
        title: "Follow Up",
        url: "/follow_up",
        icon: Calendar,
      },
      {
        title: "Outpatients Screening",
        url: "/screening",
        icon: Activity,
      },
    ],
  },
  {
    label: "Treatment",
    items: [
      {
        title: "Dispancy",
        url: "/dispancy",
        icon: Syringe,
      },
      {
        title: "Pharmacy",
        url: "/medications",
        icon: Pill,
      },
    ],
  },
  {
    label: "Facility",
    items: [
      {
        title: "Departments",
        url: "/departments",
        icon: Building2,
      },
      {
        title: "Referrals",
        url: "/referrals",
        icon: ArrowRightLeft,
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="floating">
       <SidebarContent>
         {menuGroups.map((group) => (
           <SidebarGroup key={group.label}>
             <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
             <SidebarGroupContent>
               <SidebarMenu>
                 {group.items.map((item) => (
                   <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton asChild>
                       <a href={item.url}>
                         <item.icon className="w-5 h-5" />
                         <span>{item.title}</span>
                       </a>
                     </SidebarMenuButton>
                   </SidebarMenuItem>
                 ))}
               </SidebarMenu>
             </SidebarGroupContent>
           </SidebarGroup>
         ))}
       </SidebarContent>
     </Sidebar>
  );
}

export default AppSidebar;
