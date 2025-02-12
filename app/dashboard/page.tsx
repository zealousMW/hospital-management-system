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
    // <SidebarProvider
    //   style={
    //     {
    //       "--sidebar-width": "19rem",
    //     } as React.CSSProperties
    //   }
    // >
    //   <AppSidebar />
    //   <SidebarInset>
    //     <SidebarTrigger className="-ml-1" />

    //     <Tabs defaultValue="overview" className="space-y-4">
    //       <TabsList>
    //         <TabsTrigger value="overview">Overview</TabsTrigger>
    //         <TabsTrigger value="analytics">Analytics</TabsTrigger>
    //         <TabsTrigger value="notifications">Notifications</TabsTrigger>
    //       </TabsList>

    //       <TabsContent value="overview" className="space-y-4">
    //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    //           {patientStats.map((stat) => (
    //             <Card key={stat.title}>
    //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //                 <CardTitle className="text-sm font-medium">
    //                   {stat.title}
    //                 </CardTitle>
    //                 <stat.icon className="h-4 w-4 text-muted-foreground" />
    //               </CardHeader>
    //               <CardContent>
    //                 <div className="text-3xl font-semibold">{stat.value}</div>
    //               </CardContent>
    //             </Card>
    //           ))}
    //         </div>
    //         <div className="p-8 bg-gray-50">
    //           <h1 className="text-4xl font-bold text-blue-600 text-center mb-6">
    //             Department-wise Patients Count : {today}
    //           </h1>
    //           <div className="flex items-center justify-center bg-white dark:bg-gray-900 p-2 m-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
    //             <RadioGroup
    //               defaultValue={selectedType}
    //               onValueChange={setSelectedType}
    //               className="flex justify-between gap-8"
    //             >
    //               {options.map((option) => (
    //                 <div
    //                   key={option.value}
    //                   onClick={() => setSelectedType(option.value)}
    //                   className={cn(
    //                     "cursor-pointer text-lg font-medium px-4 py-2 ms-5 rounded-lg transition-all",
    //                     selectedType === option.value
    //                       ? "bg-blue-500 text-white shadow-md"
    //                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
    //                   )}
    //                 >
    //                   <RadioGroupItem
    //                     value={option.value}
    //                     id={option.value}
    //                     className="hidden"
    //                   />
    //                   <Label htmlFor={option.value} className="cursor-pointer">
    //                     {option.label}
    //                   </Label>
    //                 </div>
    //               ))}
    //             </RadioGroup>
    //           </div>
    //           <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
    //            {filteredStats.map((stat) => (
    //               <Card key={stat.department_name}>
    //                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //                   <CardTitle className="text-1xl font-medium">
    //                     {stat.department_name}
    //                   </CardTitle>
    //                   {/* <ReceiptText className="h-5 w-5 text-muted-foreground" /> */}
    //                 </CardHeader>
    //                 <CardContent>
    //                   <div className="overflow-x-auto">
    //                     <table className="w-full border-collapse border mt-4 border-gray-300 text-center">
    //                       <thead>
    //                         <tr className="bg-gray-100">
    //                           <th className="border border-gray-300 px-4 py-2">
    //                             O
    //                           </th>
    //                           <th className="border border-gray-300 px-4 py-2">
    //                             N
    //                           </th>
    //                           <th className="border border-gray-300 px-4 py-2">
    //                             M
    //                           </th>
    //                           <th className="border border-gray-300 px-4 py-2">
    //                             F
    //                           </th>
    //                           <th className="border border-gray-300 px-4 py-2">
    //                             C
    //                           </th>
    //                           <th className="border border-gray-300 px-4 py-2">
    //                             T
    //                           </th>
    //                         </tr>
    //                       </thead>
    //                       <tbody>
    //                         <tr>
    //                           <td className="border border-gray-300 px-4 py-2">
    //                             {stat.total_old_visits || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2">
    //                             {stat.total_visits_today || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2">
    //                             {stat.total_male_visits || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2">
    //                             {stat.total_female_visits || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2">
    //                             {stat.total_child_visits || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2">
    //                             {stat.total_visits_overall || 0}
    //                           </td>
    //                         </tr>
    //                       </tbody>
    //                     </table>
    //                   </div>
    //                 </CardContent>
    //               </Card>
    //            ))}
    //           </div>
    //        </div>

    //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
    //           <Card className="col-span-4">
    //             <CardHeader>
    //               <CardTitle>
    //                 <span>Trends</span>
    //                 <select className="text-sm border rounded p-1 float-right">
    //                   <option value="diseases">Diseases</option>
    //                   <option value="beds">Bed Utilization</option>
    //                   <option value="patients">Patient Flow</option>
    //                 </select>
    //               </CardTitle>
    //             </CardHeader>
    //             <CardContent className="pl-2">
    //               <PatientChart />
    //             </CardContent>
    //           </Card>
    //           <Card className="col-span-3">
    //             <CardHeader>
    //               <CardTitle>Recents Activity</CardTitle>
    //             </CardHeader>
    //             <CardDescription>
    //               <p className="p-3">Recent activities in the system</p>
    //             </CardDescription>
    //             <CardContent>
    //               <RecentAct />
    //             </CardContent>
    //           </Card>
    //         </div>
    //       </TabsContent>

    //       <TabsContent value="analytics">
    //         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
    //           <NonCommunicableDiseaseChart />
    //           <InpatientsAndOutpatientsChart />
    //         </div>
    //         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
    //           <RevenueExpensesChart />
    //           <ERVisitsChart />
    //         </div>
    //       </TabsContent>

    //       <TabsContent value="notifications">
    //         <Notifications />
    //       </TabsContent>
    //     </Tabs>
    //   </SidebarInset>
    // </SidebarProvider>
    <SidebarProvider
      style={{
        // "--sidebar-width": "19rem",
        backgroundColor: "#F0F4F8", // Light background for professional look
      }}
    >
      <AppSidebar />

      <SidebarInset>
        <div className="fixed top-0 w-full flex items-center  space-x-2 p-2 bg-white shadow-md rounded-lg">
          <img
            src="asserts/College.jpg"
            alt="logo"
            className="h-20 w-20 rounded-full object-cover shadow-lg border-2 border-green-700"
          />
          <h1 className="text-3xl font-bold text-green-700">
            Government Siddha Medical College - Tirunelveli
          </h1>
        </div>

        <Tabs
          defaultValue="overview"
          className="space-y-4 mt-5 bg-gradient-to-br from-green-200 via-green-300 to-green-400 p-4 rounded-xl shadow-lg"
        >
          <TabsList className="bg-gradient-to-r from-green-500 to-green-700 text-white p-2 rounded-lg shadow-md">
            <TabsTrigger
              value="overview"
              className="text-white data-[state=active]:bg-green-700 data-[state=active]:shadow-lg"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-white data-[state=active]:bg-green-700 data-[state=active]:shadow-lg"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="text-white data-[state=active]:bg-green-700 data-[state=active]:shadow-lg"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {patientStats.map((stat) => (
                <Card
                  key={stat.title}
                  className="bg-gradient-to-br from-green-300 via-green-400 to-green-500 text-white shadow-md"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-green-800" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="p-8 bg-gradient-to-r from-green-100 via-green-200 to-green-300 rounded-xl shadow-md">
              <h1 className="text-4xl font-bold text-green-800 text-center mb-6">
                Department-wise Patients Count : {today}
              </h1>

              <div className="flex items-center justify-center bg-white p-2 m-4 rounded-xl shadow-md border border-green-300">
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
                          ? "bg-green-500 text-white shadow-md"
                          : "text-gray-700 hover:bg-green-200"
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

              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                {filteredStats.map((stat) => (
                  <Card
                    key={stat.department_name}
                    className="bg-gradient-to-br from-green-200 via-green-300 to-green-400 text-gray-900 shadow-md"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">
                        {stat.department_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border mt-4 border-green-300 text-center bg-white rounded-lg shadow-sm">
                          <thead>
                            <tr className="bg-green-100">
                              <th className="border border-green-300 px-4 py-2">
                                O
                              </th>
                              <th className="border border-green-300 px-4 py-2">
                                N
                              </th>
                              <th className="border border-green-300 px-4 py-2">
                                M
                              </th>
                              <th className="border border-green-300 px-4 py-2">
                                F
                              </th>
                              <th className="border border-green-300 px-4 py-2">
                                C
                              </th>
                              <th className="border border-green-300 px-4 py-2">
                                T
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-green-300 px-4 py-2">
                                {stat.total_old_visits || 0}
                              </td>
                              <td className="border border-green-300 px-4 py-2">
                                {stat.total_visits_today || 0}
                              </td>
                              <td className="border border-green-300 px-4 py-2">
                                {stat.total_male_visits || 0}
                              </td>
                              <td className="border border-green-300 px-4 py-2">
                                {stat.total_female_visits || 0}
                              </td>
                              <td className="border border-green-300 px-4 py-2">
                                {stat.total_child_visits || 0}
                              </td>
                              <td className="border border-green-300 px-4 py-2">
                                {stat.total_visits_overall || 0}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 bg-gradient-to-r from-green-300 to-green-500 text-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Trends</span>
                    <select className="text-sm border rounded p-1 bg-green-200 text-green-800">
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

              <Card className="col-span-3 bg-gradient-to-br from-green-200 to-green-400 text-gray-900 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
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
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <NonCommunicableDiseaseChart />
              <InpatientsAndOutpatientsChart />
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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
