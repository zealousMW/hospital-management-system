
'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, Eye } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Updated interface for patient data
interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
    dateTime: string;
    status: string;
    department?: string;
    cause?: string;
}

// Mock data
const mockUnassignedPatients: Patient[] = [
    {
        id: 1,
        name: "John Doe",
        age: 35,
        gender: "Male",
        dateTime: "2024-01-20 09:30 AM",
        status: "Waiting",
    },
    {
        id: 2,
        name: "Jane Smith",
        age: 28,
        gender: "Female",
        dateTime: "2024-01-20 10:15 AM",
        status: "Waiting",
    },
    {
        id: 3,
        name: "Mike Johnson",
        age: 45,
        gender: "Male",
        dateTime: "2024-01-20 10:45 AM",
        status: "In Screening",
    },
];

const mockAssignedPatients: Patient[] = [
    {
        id: 4,
        name: "Sarah Wilson",
        age: 32,
        gender: "Female",
        dateTime: "2024-01-20 08:30 AM",
        status: "Assigned",
        department: "Cardiology",
        cause: "Chest pain and shortness of breath"
    },
    {
        id: 5,
        name: "Robert Brown",
        age: 41,
        gender: "Male",
        dateTime: "2024-01-20 09:15 AM",
        status: "Assigned",
        department: "Orthopedics",
        cause: "Severe back pain"
    },
];

const departments = [
    "Emergency",
    "General Medicine",
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
];

export default function Screening() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [department, setDepartment] = useState("");
    const [cause, setCause] = useState("");
    const [viewCause, setViewCause] = useState<{ cause: string; patient: string } | null>(null);

    const handleAssign = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        // Handle the assignment submission here
        console.log({
            patientId: selectedPatient?.id,
            department,
            cause,
        });
        setIsDialogOpen(false);
        setDepartment("");
        setCause("");
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Patient Screening Queue</h2>
            <Tabs defaultValue="unassigned" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="unassigned">Unassigned Patients</TabsTrigger>
                    <TabsTrigger value="assigned">Assigned Patients</TabsTrigger>
                </TabsList>

                <TabsContent value="unassigned">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockUnassignedPatients.map((patient) => (
                                    <TableRow key={patient.id}>
                                        <TableCell className="font-medium">{patient.name}</TableCell>
                                        <TableCell>{patient.age}</TableCell>
                                        <TableCell>{patient.gender}</TableCell>
                                        <TableCell>{patient.dateTime}</TableCell>
                                        <TableCell>
                                            <Badge variant={patient.status === "Waiting" ? "secondary" : "default"}>
                                                {patient.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAssign(patient)}
                                            >
                                                <ClipboardList className="h-4 w-4 mr-2" />
                                                Assign
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="assigned">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Cause</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockAssignedPatients.map((patient) => (
                                    <TableRow key={patient.id}>
                                        <TableCell className="font-medium">{patient.name}</TableCell>
                                        <TableCell>{patient.age}</TableCell>
                                        <TableCell>{patient.gender}</TableCell>
                                        <TableCell>{patient.dateTime}</TableCell>
                                        <TableCell>{patient.department}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hover:bg-transparent p-0 h-auto font-normal"
                                                onClick={() => setViewCause({ 
                                                    cause: patient.cause || '', 
                                                    patient: patient.name 
                                                })}
                                            >
                                                <span className="max-w-[200px] truncate block">
                                                    {patient.cause}
                                                </span>
                                                {patient.cause && patient.cause.length > 30 && (
                                                    <Eye className="h-3 w-3 ml-2 inline-block" />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAssign(patient)}
                                            >
                                                <ClipboardList className="h-4 w-4 mr-2" />
                                                Reassign
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Department and Cause</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Select value={department} onValueChange={setDepartment}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cause">Cause of Visit</Label>
                            <Textarea
                                id="cause"
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
                        <Button onClick={handleSubmit}>
                            Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!viewCause} onOpenChange={() => setViewCause(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cause of Visit - {viewCause?.patient}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 text-sm">
                        {viewCause?.cause}
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setViewCause(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}