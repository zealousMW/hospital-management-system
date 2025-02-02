import {
  Users,
  UserCog,
  Building2,
  Bed,
  ClipboardList,
  Pill,
  Activity,
  FileText,
  Syringe,
  ArrowRightLeft,
  LayoutDashboard
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuGroups = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      }
    ]
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
        title: "Visits",
        url: "/visits",
        icon: ClipboardList,
      },
      {
        title: "Outpatients Screening",
        url: "/symptoms",
        icon: Activity,
      }
    ]
  },
  {
    label: "Treatment",
    items: [
      {
        title: "Medications",
        url: "/medications",
        icon: Pill,
      },
      {
        title: "Treatments",
        url: "/treatments",
        icon: Syringe,
      },
      {
        title: "Prescriptions",
        url: "/prescriptions",
        icon: FileText,
      }
    ]
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
        title: "Beds & Rooms",
        url: "/beds",
        icon: Bed,
      },
      {
        title: "Referrals",
        url: "/referrals",
        icon: ArrowRightLeft,
      }
    ]
  },
  {
    label: "Staff",
    items: [
      {
        title: "Doctors",
        url: "/doctors",
        icon: UserCog,
      }
    ]
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="floating" >
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
  )
}

export default AppSidebar