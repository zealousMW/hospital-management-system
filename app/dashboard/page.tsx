import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PatientChart } from "@/components/dashboard/patientchart";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  BedDouble,
  UserPlus,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import RecentAct from "@/components/dashboard/recentactivities";
import {
  ERVisitsChart,
  InpatientChart,
  InpatientsAndOutpatientsChart,
  NonCommunicableDiseaseChart,
  RevenueExpensesChart,
} from "@/components/dashboard/graphs/graphs";
import Notifications from "@/components/dashboard/notifications";

export default async function PrivatePage() {
  const patientStats = [
    {
      title: "Inpatients",
      value: 124,
      icon: BedDouble,
    },
    {
      title: "Outpatients",
      value: 305,
      icon: UserPlus,
    },
    {
      title: "Available Beds",
      value: 45,
      icon: BedDouble,
    },
    {
      title: "Today's Visits",
      value: 89,
      icon: Users,
    },
  ];

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
        <SidebarTrigger className="-ml-1" />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {patientStats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>
                    <span>Trends</span>
                    <select className="text-sm border rounded p-1 float-right">
                      <option value="diseases">Diseases</option>
                      <option value="beds">Bed Utilization</option>
                      <option value="patients">Patient Flow</option>
                    </select>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <PatientChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recents Activity</CardTitle>
                </CardHeader>
                <CardDescription>
                  <p className="p-3">Recent activities in the system</p>
                </CardDescription>
                <CardContent>
                  <RecentAct />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
              <NonCommunicableDiseaseChart />
              <InpatientsAndOutpatientsChart />
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
              <RevenueExpensesChart />
              <ERVisitsChart />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Notifications />
          </TabsContent>
        </Tabs>
      </SidebarInset>
    </SidebarProvider>
  );
}
