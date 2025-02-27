"use client";

import { getIndianDate } from "@/lib/utils";
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
  HospitalIcon,
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
    total_old_visits: number;
    total_visits_today: number;
    total_visits_overall: number;
    total_male_visits: number;
    total_female_visits: number;
    total_child_visits: number;
    total_adult_visits: number;
  }

  const [stats, setStats] = useState<Stat[]>([]);
  const today = getIndianDate(); // Replace existing date with Indian format
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Outpatients",
      value: 305,
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Available Beds",
      value: 45,
      icon: BedDouble,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Today's Visits",
      value: 89,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "19rem" } as React.CSSProperties}
      className="bg-gray-50"
    >
      <AppSidebar />
      <SidebarInset className="p-6">
        <SidebarTrigger className="absolute top-4 left-4" />

        <Tabs defaultValue="overview" className="space-y-6 mt-5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">govt siddha hospital palayamkottai</h1>
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {patientStats.map((stat) => (
                <Card key={stat.title} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Department-wise Patients Count: {today} {/* This will now show Indian date */}
              </h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <RadioGroup
                  defaultValue={selectedType}
                  onValueChange={setSelectedType}
                  className="flex flex-wrap gap-4"
                >
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "cursor-pointer rounded-lg px-6 py-3 transition-colors",
                        selectedType === option.value
                          ? "bg-primary text-white shadow-md"
                          : "bg-white hover:bg-gray-100"
                      )}>
                      <RadioGroupItem value={option.value} id={option.value} className="hidden" />
                      <Label htmlFor={option.value} className="cursor-pointer font-medium">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredStats.map((stat) => (
                  <Card key={stat.department_name} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gray-50 rounded-t-lg border-b">
                      <CardTitle className="text-lg font-semibold text-gray-700">
                        {stat.department_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-600">
                            <th className="px-2 py-2 border-b">Old</th>
                            <th className="px-2 py-2 border-b">New</th>
                            <th className="px-2 py-2 border-b">Male</th>
                            <th className="px-2 py-2 border-b">Female</th>
                            <th className="px-2 py-2 border-b">Child</th>
                            <th className="px-2 py-2 border-b">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-center">
                            <td className="px-2 py-3 text-blue-600 font-medium">{stat.total_old_visits || 0}</td>
                            <td className="px-2 py-3 text-green-600 font-medium">{stat.total_visits_today || 0}</td>
                            <td className="px-2 py-3 text-gray-800">{stat.total_male_visits || 0}</td>
                            <td className="px-2 py-3 text-gray-800">{stat.total_female_visits || 0}</td>
                            <td className="px-2 py-3 text-gray-800">{stat.total_child_visits || 0}</td>
                            <td className="px-2 py-3 text-primary font-bold">{stat.total_visits_overall || 0}</td>
                          </tr>
                        </tbody>
                      </table>
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
