"use client";

interface Patient {
  visit_id: number;
  name: string;
  age: number;
  gender: string;
  date_of_visit: string;
  cause_of_visit: string;
}

interface Department {
  department_id: number;
  department_name: string;
  department_type: string;
}

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, Hospital, Users, Activity, CalendarRange } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, isToday, parseISO } from "date-fns";


export default function Screening() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentType, setDepartmentType] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [department, setDepartment] = useState("");
  const [cause, setCause] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [departmentType]);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/screening");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `/api/departmentApi?department_type=${departmentType}`
      );
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleAssign = (patient: Patient) => {
    setSelectedPatient(patient);
    setCause(patient.cause_of_visit);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedPatient) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/screening", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visit_id: selectedPatient.visit_id,
          assigned_department: Number(department),
          cause_of_visit: cause,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      await fetchPatients();
      setIsDialogOpen(false);
      setDepartment("");
      setCause("");
      setDepartmentType("");
    } catch (error) {
      console.error("Error updating patient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDepartments = departments.filter(
    (dept) => dept.department_type === departmentType
  );

  const filteredPatients = patients.filter((patient) =>
    String(patient.visit_id).includes(searchQuery)
  );

  const stats = [
    {
      title: "Total Screenings Today",
      value: filteredPatients.filter(p => isToday(parseISO(p.date_of_visit))).length,
      icon: Users,
    },
    {
      title: "Waiting for Screening",
      value: filteredPatients.length,
      icon: Activity,
    },
    {
      title: "Screened Today",
      value: 0,
      icon: CalendarRange,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-4 space-y-6"
    >
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
                Patient Screening Queue
              </CardTitle>
              <p className="text-muted-foreground">Manage patient screening and department assignments</p>
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="space-y-2">
            <Label>Search by Visit ID</Label>
            <Input
              type="text"
              placeholder="Search by Visit ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
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
                  <TableHead>Gender</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.visit_id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{patient.visit_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {patient.name.charAt(0)}
                          </div>
                          <span>{patient.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.gender}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isToday(parseISO(patient.date_of_visit)) ? "default" : "secondary"}
                        >
                          {format(parseISO(patient.date_of_visit), "dd MMM yyyy")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleAssign(patient)}>
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Screening
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Hospital className="h-8 w-8 mb-2" />
                        <p>No patients in screening queue</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Department and Symptoms</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <Label>Symptoms</Label>
              <Textarea
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder="Enter the cause of visit"
              />
            </div>
            <div>
              <Label>Department Type</Label>
              <Select value={departmentType} onValueChange={setDepartmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PG">PG</SelectItem>
                  <SelectItem value="UG">UG</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDepartments.map((dept) => (
                    <SelectItem
                      key={dept.department_id}
                      value={dept.department_id.toString()}
                    >
                      {dept.department_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Assign Dept"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
