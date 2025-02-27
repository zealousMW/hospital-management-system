"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import AddVisitPage from "./addop";
import { Hospital, Plus, CalendarIcon, Filter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isToday, parseISO, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { CalendarRange, Users, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OutpatientVisit {
  visit_id: number;
  name: string;
  age: number;
  gender: string;
  date_of_visit: string;
  department: string;
  status: "active" | "completed" | "cancelled";
}

const Visitstable = () => {
  const [outpatientVisits, setOutpatientVisits] = useState<OutpatientVisit[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScreening, setIsScreening] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isScreening");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [startDate, setStartDate] = useState<Date | undefined>(() => new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(() => new Date());
  const [open, setOpen] = useState(false);

  // Save to localStorage when isScreening changes
  useEffect(() => {
    localStorage.setItem("isScreening", JSON.stringify(isScreening));
  }, [isScreening]);

  const fetchVisitsData = async () => {
    try {
      // Set the time to the start and end of the local day
      const today = new Date();
      const defaultStartDate = startOfDay(today);
      const defaultEndDate = endOfDay(today);

      const startDateToUse = startDate ? startOfDay(startDate) : defaultStartDate;
      const endDateToUse = endDate ? endOfDay(endDate) : defaultEndDate;

      const url = new URL("/api/visits", window.location.origin);
      url.searchParams.append("startDate", startDateToUse.toISOString());
      url.searchParams.append("endDate", endDateToUse.toISOString());

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch visits");
      const data = await response.json();
      setOutpatientVisits(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitsData();
  }, [startDate, endDate]);

  const refreshTable = () => {
    setLoading(true);
    fetchVisitsData().finally(() => {
      setLoading(false);
      setOpen(false); // Close the dialog after successful submission
    });
  };

  const filteredVisits = outpatientVisits.filter((visit) =>
    Object.values(visit).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const stats = [
    {
      title: "Total Visits Today",
      value: filteredVisits.filter(v => isToday(parseISO(v.date_of_visit))).length,
      icon: Users,
    },
    {
      title: "Active Visits",
      value: filteredVisits.filter(v => v.status === "active").length,
      icon: Activity,
    },
    {
      title: "Completed Visits",
      value: filteredVisits.filter(v => v.status === "completed").length,
      icon: CalendarRange,
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 space-y-4">
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-4 space-y-6"
    >
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center">
                <Hospital className="mr-2 h-6 w-6 text-primary" />
                Outpatient Visits
              </CardTitle>
              <p className="text-muted-foreground">Manage and track patient visits</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Visit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Add OutPatient Visit</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[80vh]">
                  <AddVisitPage isScreening={isScreening} onSuccess={refreshTable} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-6" />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by name, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2 bg-secondary/10 p-3 rounded-md w-full">
                <Switch checked={isScreening} onCheckedChange={setIsScreening} />
                <Label>Screening Mode</Label>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Visit ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => (
                    <TableRow key={visit.visit_id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{visit.visit_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {visit.name.charAt(0)}
                          </div>
                          <span>{visit.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{visit.age}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{visit.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            isToday(parseISO(visit.date_of_visit))
                              ? "default"
                              : "secondary"
                          }
                        >
                          {format(parseISO(visit.date_of_visit), "dd MMM yyyy")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Visit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Cancel Visit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Hospital className="h-8 w-8 mb-2" />
                        <p>No visits found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Visitstable;
