"use client";

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
import { ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input"; // Add this import
import { useState, useEffect } from "react";

interface Department {
  department_id: number;
  department_name: string;
  department_type: string;
  description: string;
}

interface Patient {
  visit_id: string;
  name: string;
  age: string;
  gender: string;
  date_of_visit: string;
  department: string;
  cause_of_visit: string;
}

export default function Screening() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentType, setDepartmentType] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [department, setDepartment] = useState("");
  const [cause, setCause] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Add this state

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
          assigned_department: Number(department), // Convert to number since department now contains the ID
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

  // Fix the filter function by converting both values to strings
  const filteredPatients = patients.filter((patient) =>
    String(patient.visit_id).includes(searchQuery)
  );

  return (
    <div>
      <h2>Patient Screening Queue</h2>

      {/* Update search placeholder text */}
      <div className="my-4">
        <Input
          type="text"
          placeholder="Search by Visit ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Visit ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <TableRow key={patient.visit_id}>
                <TableCell>{patient.visit_id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.date_of_visit}</TableCell>
                <TableCell>
                  <Button onClick={() => handleAssign(patient)}>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Assign
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No patients available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Department and Cause</DialogTitle>
          </DialogHeader>
          <div>
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
            <div>
              <Label>Cause of Visit</Label>
              <Textarea
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder="Enter the cause of visit"
              />
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
    </div>
  );
}
