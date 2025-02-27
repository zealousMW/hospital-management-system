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
import { format, isToday, parseISO } from "date-fns";
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
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Save to localStorage when isScreening changes
  useEffect(() => {
    localStorage.setItem("isScreening", JSON.stringify(isScreening));
  }, [isScreening]);

  const fetchVisitsData = async () => {
    try {
      const startDateStr = startDate?.toISOString().split("T")[0];
      const endDateStr = endDate?.toISOString().split("T")[0];

      const url = new URL("/api/visits", window.location.origin);
      if (startDateStr && endDateStr) {
        url.searchParams.append("startDate", startDateStr);
        url.searchParams.append("endDate", endDateStr);
      }

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

  const filteredVisits = outpatientVisits.filter((visit) =>
    Object.values(visit).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 space-y-4">
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Outpatient Visits</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Visit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Add OutPatient Visit</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[80vh]">
                  <AddVisitPage isScreening={isScreening} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <Input
                placeholder="Search visits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      console.log("Start Date Selected:", date);
                      if (date) setStartDate(date);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      console.log("End Date Selected:", date);
                      if (date) setEndDate(date);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={isScreening} onCheckedChange={setIsScreening} />
              <Label>Enable Screening</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
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
                    <TableRow key={visit.visit_id}>
                      <TableCell className="font-medium">
                        #{visit.visit_id}
                      </TableCell>
                      <TableCell>{visit.name}</TableCell>
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
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No visits found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Visitstable;
