"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Hospital, Plus, CalendarIcon, Users, Activity, CalendarRange } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday, parseISO } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import AddInpatientForm from './addip';

interface InpatientVisit {
  inpatient_id: number;
  outpatient_id: number;
  ward_id: string;
  bed_id: string;
  admission_date: string;
  admission_time: string;
  attender_name: string;
  attender_relationship: string;
  attender_contact_number: string;
  attender_ward_id?: string;
  attender_bed_id?: string;
  outpatient: {
    name: string;
    age: number;
    gender: string;
  };
}

const Inpatientvisits = () => {
  const [inpatientVisits, setInpatientVisits] = useState<InpatientVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(() => new Date());
  const [open, setOpen] = useState(false);

  const fetchVisitsData = async () => {
    try {
      const response = await fetch('/api/inpatientvisit');
      if (!response.ok) throw new Error('Failed to fetch inpatient visits');
      const data = await response.json();
      setInpatientVisits(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitsData();
  }, []);

  const stats = [
    {
      title: "Total Inpatients",
      value: inpatientVisits.length,
      icon: Users,
    },
    {
      title: "New Admissions Today",
      value: inpatientVisits.filter(v => isToday(parseISO(v.admission_date))).length,
      icon: Activity,
    },
    {
      title: "Available Beds",
      value: "25", // Replace with actual bed count logic
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
                Inpatient Admissions
              </CardTitle>
              <p className="text-muted-foreground">Manage and track inpatient admissions</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Admission
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Add New InPatient</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[80vh]">
                  <AddInpatientForm />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-6" />
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by name, ward, bed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Filter by Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Ward & Bed</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Attender Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inpatientVisits.length > 0 ? (
                  inpatientVisits.map((visit) => (
                    <TableRow key={visit.inpatient_id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {visit.outpatient.name.charAt(0)}
                          </div>
                          <div>
                            <div>{visit.outpatient.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {visit.outpatient.age} yrs, {visit.outpatient.gender}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Ward {visit.ward_id}</Badge>
                        <div className="text-sm text-muted-foreground">Bed {visit.bed_id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isToday(parseISO(visit.admission_date)) ? "default" : "secondary"}>
                          {format(parseISO(visit.admission_date), "dd MMM yyyy")}
                        </Badge>
                        <div className="text-sm text-muted-foreground">{visit.admission_time}</div>
                      </TableCell>
                      <TableCell>
                        {visit.attender_name}
                        <div className="text-sm text-muted-foreground">{visit.attender_relationship}</div>
                      </TableCell>
                      <TableCell>{visit.attender_contact_number}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Discharge Patient
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
                        <p>No inpatients found</p>
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

export default Inpatientvisits;