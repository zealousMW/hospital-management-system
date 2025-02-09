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
        icon: Bed,  // Changed from Activity to Bed
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
        title: "pharmacy",
        url: "/medications",
        icon: Pill,
      },
      // {
      //   title: "diagnosis",
      //   url: "/checking",
      //   icon: Syringe,
      // },
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
        <div className="flex items-center p-4 border-b border-gray-700">
          {/* Profile Image */}
          <Avatar className="mr-4">
            <AvatarImage asChild>
              <Image
                src="/asserts/College.jpg"
                alt="College Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            </AvatarImage>
            <AvatarFallback>GSM</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-bold text-xl text-gray-900 m-1">
              Government Siddha Medical College
            </span>
            <Badge variant="outline" color="primary" className="text-sm m-2">
              Admin
            </Badge>
          </div>
        </div>
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
