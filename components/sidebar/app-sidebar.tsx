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
      <SidebarContent className="h-screen w-64 bg-gradient-to-b from-green-300 via-green-500 to-green-700 text-white shadow-xl">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="mt-6">
            <SidebarGroupLabel className="text-lg font-semibold text-green-100 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="flex items-center gap-3 p-2 hover:bg-green-800 rounded-lg transition-all cursor-pointer"
                      >
                        <item.icon className="h-6 w-6 text-white" />
                        <span className="text-lg text-white">{item.title}</span>
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
