"use client";

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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Avatar from ShadCN UI
import { Button } from "@/components/ui/button"; // Button from ShadCN UI
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions";

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
    label: "Registration",
    items: [
      {
        title: "Outpatients Registration",
        url: "/op_registration",
        icon: ClipboardList,
      },
      {
        title: "InPatient Registration",
        url: "/ip_registration",
        icon: Bed,
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
        title: "Outpatients Screening",
        url: "/screening",
        icon: Activity,
      },
      {
        title: "InPatient Follow Up",
        url: "/follow_up",
        icon: Calendar,
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
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAction();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
       <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
       </SidebarFooter>
     </Sidebar>
  );
}

export default AppSidebar;
