"use client";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Activity,
  BedDouble,
  UserPlus,
  Users,
  TrendingUp,
  AlertCircle,
  ReceiptText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RecentAct from "@/components/dashboard/recentactivities";
import {
  ERVisitsChart,
  InpatientChart,
  InpatientsAndOutpatientsChart,
  NonCommunicableDiseaseChart,
  RevenueExpensesChart,
} from "@/components/dashboard/graphs/graphs";
import Notifications from "@/components/dashboard/notifications";
import { useEffect, useState } from "react";

export default function PrivatePage() {
  interface Stat {
    department_name: string;
    department_type: string;
    total_visits_today: number;
    total_visits_overall: number;
    total_male_visits: number;
    total_female_visits: number;
  }

  const [stats, setStats] = useState<Stat[]>([]);
  const today = new Date().toISOString().split("T")[0];
  const [selectedType, setSelectedType] = useState("UG");

  const filteredStats = stats.filter(
    (stat) => stat.department_type === selectedType
  );
  useEffect(() => {
    Counts();
  }, []);
  const Counts = async () => {
    try {
      const response = await fetch("/api/countapi");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const options = [
    { value: "UG", label: "Undergraduate" },
    { value: "PG", label: "Postgraduate" },
    { value: "special", label: "Special Program" },
  ];
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
            <div className="p-8 bg-gray-50">
              <h1 className="text-4xl font-bold text-blue-600 text-center mb-6">
                Department-wise Patients Count : {today}
              </h1>
              <div className="flex items-center justify-center bg-white dark:bg-gray-900 p-2 m-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <RadioGroup
                  defaultValue={selectedType}
                  onValueChange={setSelectedType}
                  className="flex justify-between gap-8"
                >
                  {options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => setSelectedType(option.value)}
                      className={cn(
                        "cursor-pointer text-lg font-medium px-4 py-2 ms-5 rounded-lg transition-all",
                        selectedType === option.value
                          ? "bg-blue-500 text-white shadow-md"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                      )}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="hidden"
                      />
                      <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {filteredStats.map((stat) => (
                  <Card key={stat.department_name}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-2xl font-bold">
                        {stat.department_name}
                      </CardTitle>
                      {/* <ReceiptText className="h-5 w-5 text-muted-foreground" /> */}
                    </CardHeader>
                    <CardContent>
                      <div className="text-1xl font-semibold flex space-x-2">
                        <p> Male - {stat.total_male_visits} </p>
                        <p>Female- {stat.total_female_visits}</p>
                        <p>Total - {stat.total_visits_today}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
