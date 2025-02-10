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
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                {filteredStats.map((stat) => (
                  <Card key={stat.department_name}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-1xl font-medium">
                        {stat.department_name}
                      </CardTitle>
                      {/* <ReceiptText className="h-5 w-5 text-muted-foreground" /> */}
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border mt-4 border-gray-300 text-center">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-2">
                                O
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                N
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                M
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                F
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                C
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                T
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2">
                                {stat.total_old_visits || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {stat.total_visits_today || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {stat.total_male_visits || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {stat.total_female_visits || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {stat.total_child_visits || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
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
    // <SidebarProvider
    //   style={{
    //     // "--sidebar-width": "19rem",
    //     backgroundColor: "#F0F4F8", // Light background for professional look
    //   }}
    // >
    //   <AppSidebar />
    //   <SidebarInset>
    //     {/* <div className="container mx-auto flex items-center justify-center space-x-4">
    //       <img
    //         src="/college-logo.png"
    //         alt="College Logo"
    //         className="h-12 w-12 rounded-full shadow-md"
    //       />
    //       <h1 className="text-5xl font-extrabold text-center text-white mb-8 p-6 rounded-lg shadow-2xl bg-gradient-to-r from-blue-500 via-green-400 to-blue-500 border-4 border-white">
    //         Government Siddha Medical College - Tirunelveli
    //       </h1>
    //     </div> */}

    //     <SidebarTrigger className="-ml-1" />

    //     <Tabs defaultValue="overview" className="space-y-4 text-gray-800">
    //       <TabsList className="bg-gray-200 p-2 rounded-lg">
    //         <TabsTrigger value="overview">Overview</TabsTrigger>
    //         <TabsTrigger value="analytics">Analytics</TabsTrigger>
    //         <TabsTrigger value="notifications">Notifications</TabsTrigger>
    //       </TabsList>

    //       <TabsContent value="overview" className="space-y-4">
    //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    //           {patientStats.map((stat) => (
    //             <Card key={stat.title} className="bg-white shadow-md">
    //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //                 <CardTitle className="text-sm font-medium text-gray-700">
    //                   {stat.title}
    //                 </CardTitle>
    //                 <stat.icon className="h-4 w-4 text-gray-500" />
    //               </CardHeader>
    //               <CardContent>
    //                 <div className="text-3xl font-semibold text-blue-600">
    //                   {stat.value}
    //                 </div>
    //               </CardContent>
    //             </Card>
    //           ))}
    //         </div>
    //         <div className="p-8 bg-white rounded-lg shadow-md">
    //           <h1 className="text-4xl font-bold text-blue-600 text-center mb-6">
    //             Department-wise Patients Count : {today}
    //           </h1>
    //           <div className="flex items-center justify-center bg-gray-100 p-2 m-4 rounded-xl shadow-md border border-gray-300">
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
    //                       : "text-gray-700 hover:bg-gray-200"
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
    //             {filteredStats.map((stat) => (
    //               <Card
    //                 key={stat.department_name}
    //                 className="bg-white shadow-md"
    //               >
    //                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //                   <CardTitle className="text-1xl font-medium text-gray-700">
    //                     {stat.department_name}
    //                   </CardTitle>
    //                 </CardHeader>
    //                 <CardContent>
    //                   <div className="overflow-x-auto">
    //                     <table className="w-full border-collapse border mt-4 border-gray-300 text-center">
    //                       <thead>
    //                         <tr className="bg-gray-100 text-gray-700">
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
    //                           <td className="border border-gray-300 px-4 py-2 text-gray-700">
    //                             {stat.total_old_visits || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2 text-gray-700">
    //                             {stat.total_visits_today || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2 text-gray-700">
    //                             {stat.total_male_visits || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2 text-gray-700">
    //                             {stat.total_female_visits || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2 text-gray-700">
    //                             {total_child_visits || 0}
    //                           </td>
    //                           <td className="border border-gray-300 px-4 py-2 text-gray-700">
    //                             {stat.total_visits_overall || 0}
    //                           </td>
    //                         </tr>
    //                       </tbody>
    //                     </table>
    //                   </div>
    //                 </CardContent>
    //               </Card>
    //             ))}
    //           </div>
    //         </div>

    //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
    //           <Card className="col-span-4 bg-white shadow-md">
    //             <CardHeader>
    //               <CardTitle className="text-gray-700">
    //                 <span>Trends</span>
    //                 <select className="text-sm border rounded p-1 float-right bg-gray-100 text-gray-700">
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
    //           <Card className="col-span-3 bg-white shadow-md">
    //             <CardHeader>
    //               <CardTitle className="text-gray-700">
    //                 Recent Activity
    //               </CardTitle>
    //             </CardHeader>
    //             <CardDescription>
    //               <p className="p-3 text-gray-600">
    //                 Recent activities in the system
    //               </p>
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
  );
}
