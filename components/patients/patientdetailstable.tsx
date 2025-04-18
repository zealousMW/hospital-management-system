"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users2,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  MapPin,
  Download,
  Filter,
  RefreshCcw,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import PatientRegistrationForm from "./addpatient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Patient {
  outpatient_id: number;
  name: string;
  number: string;
  place: string;
  gender: string;
  age: number;
}
interface Inpatient {
  inpatient_id: number;
  outpatient_id: number;
  aadhaar_no: string;
  address: string;
  ward_no: number;
  bed_no: number;
  discharge_date: Date;
}

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable?: { finalY: number }; // This makes TypeScript recognize lastAutoTable
  }
}

function generatePdf(report: any) {
  var doc = new jsPDF();
  // **Header Section**
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Government Siddha Medical College - Tirunelveli", 50, 20);
  doc.setFontSize(12);
  doc.text("Discharge Summary", 90, 30);
  doc.line(20, 35, 190, 35); // **Underline**

  // **Patient Details**
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 20, 45);
  doc.setFont("helvetica", "normal");

  const patientDetails = [
    ["Patient Name", report.name],
    ["Age / Sex", `${report.age} / ${report.gender}`],
    ["Address", report.address],
    ["IP No", report.ip_id],
    ["OP No", report.op_id],
    ["Date of Admission", report.admission_date],
    ["Date of Discharge", report.discharge_date],
    ["Ward / Room No", report.ward],
    ["Patient Contact No", report.contact],
  ];

  doc.autoTable({
    startY: 50,
    head: [["Field", "Details"]],
    body: patientDetails,
    theme: "grid",
    styles: { fontSize: 10 },
  });

  // **Diagnosis & Findings**
  let yPosition = doc.lastAutoTable?.finalY
    ? doc.lastAutoTable.finalY + 10
    : 50;

  doc.setFont("helvetica", "bold");
  doc.text("Discharge Diagnosis", 20, yPosition);
  doc.setFont("helvetica", "normal");
  doc.text(report.diagnosis, 20, yPosition + 7);

  yPosition += 15;
  doc.setFont("helvetica", "bold");
  doc.text("History & Clinical Findings", 20, yPosition);
  doc.setFont("helvetica", "normal");
  doc.text(report.findings, 20, yPosition + 7);

  // **Laboratory Investigations**
  yPosition += 15;
  doc.setFont("helvetica", "bold");
  doc.text("Laboratory Investigations", 20, yPosition);

  const labResults = [
    ["Total Count (TC)", `${report.tc} cells/cu.mm`],
    [
      "Differential Count (DC)",
      `P: ${report.dc.p}%, L: ${report.dc.l}%, E: ${report.dc.e}%`,
    ],
  ];

  doc.autoTable({
    startY: yPosition + 5,
    head: [["Test", "Result"]],
    body: labResults,
    theme: "grid",
    styles: { fontSize: 10 },
  });

  // **Course in Hospital**
  yPosition = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : 50;
  doc.setFont("helvetica", "bold");
  doc.text("Course in Hospital", 20, yPosition);
  doc.setFont("helvetica", "normal");
  doc.text(report.course, 20, yPosition + 7);

  // **Medical Advice**
  yPosition += 15;
  doc.setFont("helvetica", "bold");
  doc.text("Medical Advice", 20, yPosition);
  doc.setFont("helvetica", "normal");
  report.medical_advice.forEach((advice: string, index: number) => {
    doc.text(`• ${advice}`, 20, yPosition + (index + 1) * 7);
  });

  // **Review**
  yPosition += report.medical_advice.length * 7 + 10;
  doc.setFont("helvetica", "bold");
  doc.text("Review", 20, yPosition);
  doc.setFont("helvetica", "normal");
  doc.text(report.review, 20, yPosition + 7);

  // **Footer**
  yPosition += 20;
  doc.setFont("helvetica", "bold");
  doc.text("Attending Physician:", 20, yPosition);
  doc.setFont("helvetica", "normal");
  doc.text("[Doctor’s Name]", 60, yPosition);
  doc.text("[Hospital Name]", 60, yPosition + 7);

  // **Save PDF**
  doc.save(`Discharge_Report_${report.ip_id}.pdf`);
}

const PatientDetailsTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [inpatients, setInpatients] = useState<Inpatient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Patient>("outpatient_id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [genderFilter, setGenderFilter] = useState<
    "all" | "Male" | "Female" | "Other"
  >("all");
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const options = [
    { value: "outpatients", label: "Outpatients" },
    { value: "inpatients", label: "Inpatients" },
  ];
  const [selected, setSelected] = useState("outpatients");
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchOutPatients = async () => {
      try {
        const response = await fetch("/api/outpatientsApi");
        const data = await response.json();
        setPatients(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching outpatients:", error);
        setLoading(false);
      }
    };
    const fetchInPatients = async () => {
      try {
        const response = await fetch("/api/inpatientapi");
        const data = await response.json();
        setInpatients(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inpatients:", error);
        setLoading(false);
      }
    };

    selected === "outpatients" ? fetchOutPatients() : fetchInPatients();

    //Mock data for generate Discharge Report
    setReport({
      name: "John Doe",
      age: 45,
      gender: "Male",
      address: "123 Street, City",
      ip_id: "IP12345",
      op_id: "OP67890",
      admission_date: "2025-02-01",
      discharge_date: "2025-02-10",
      ward: "General Ward - Room 5",
      contact: "+1234567890",
      diagnosis: "Bronchial Asthma",
      findings:
        "H/O Bronchial Asthma, Rhonchi (+), Bronchial Breathing (+), RR - 20/min",
      tc: 8600,
      dc: { p: 40, l: 37, e: 3 },
      course:
        "Patient took medication regularly. Symptoms reduced. Discharged in stable condition.",
      medical_advice: [
        "Drink hot water",
        "Practice breathing exercises (Pranayama)",
        "Avoid smoking",
      ],
      review: "Review after 7 days",
    });
  }, [selected]);

  const getFilteredPatients = () => {
    let filtered = [...patients];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.number.includes(searchTerm)
      );
    }

    // Gender filter
    if (genderFilter !== "all") {
      filtered = filtered.filter((patient) => patient.gender === genderFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : 1;
      }
      return aValue > bValue ? -1 : 1;
    });

    return filtered;
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredPatients = getFilteredPatients();
  const currentItems = filteredPatients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const handleViewDetails = (patientId: number) => {
    window.location.href = `http://localhost:3000/info?patientId=${patientId}`;
  };

  const handleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (patientId: number) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const response = await fetch("/api/outpatientsApi", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ outpatient_id: patientId }),
        });

        if (response.ok) {
          setPatients(patients.filter((p) => p.outpatient_id !== patientId));
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const handleAddressClick = (address: string) => {
    setSelectedAddress(address);
    setShowAddressDialog(true);
  };

  const getStatistics = () => {
    return {
      total: patients.length,
    };
  };

  const stats = getStatistics();

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Age", "Gender", "Contact", "Place"];
    const data = filteredPatients.map((p) => [
      p.outpatient_id,
      p.name,
      p.age,
      p.gender,
      p.number,
      p.place,
    ]);

    const csvContent = [headers, ...data]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    a.click();
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/outpatientsApi");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setIsRefreshing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <Users2 className="h-6 w-6" />
            <CardTitle>Patients Directory</CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refreshData}
                  disabled={isRefreshing}
                >
                  <RefreshCcw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh data</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={exportToCSV}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export to CSV</TooltipContent>
            </Tooltip>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-500 text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New Patient</DialogTitle>
                  <DialogDescription>
                    {/* Form elements for registering a new patient */}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <PatientRegistrationForm />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <Select
            value={genderFilter}
            onValueChange={(value: any) => setGenderFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <div className="flex items-center justify-center bg-white dark:bg-gray-900 p-2 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <RadioGroup
          defaultValue={selected}
          onValueChange={setSelected}
          className="flex justify-between gap-8"
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => setSelected(option.value)}
              className={cn(
                "cursor-pointer text-lg font-medium px-4 py-2 ms-5 rounded-lg transition-all",
                selected === option.value
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

      {selected === "outpatients" ? (
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-10">
              <AlertTriangle className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No patients found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={
                            selectedPatients.length === currentItems.length
                          }
                          onCheckedChange={(checked) => {
                            setSelectedPatients(
                              checked
                                ? currentItems.map((p) => p.outpatient_id)
                                : []
                            );
                          }}
                        />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Basic Info</TableHead>
                      <TableHead>Contact Details</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((patient) => (
                      <TableRow
                        key={patient.outpatient_id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedPatients.includes(
                              patient.outpatient_id
                            )}
                            onCheckedChange={(checked) => {
                              setSelectedPatients(
                                checked
                                  ? [...selectedPatients, patient.outpatient_id]
                                  : selectedPatients.filter(
                                      (id) => id !== patient.outpatient_id
                                    )
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>{patient.outpatient_id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-gray-500">
                              {patient.age} years ({patient.gender})
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{patient.number}</p>
                            <p className="text-sm text-gray-500">
                              {patient.place}
                            </p>
                            <button
                              onClick={() => handleAddressClick(patient.place)}
                              className="text-xs text-blue-500 flex items-center hover:text-blue-700"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              View Address
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleViewDetails(patient.outpatient_id)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => handleDelete(patient.outpatient_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      ) : (
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-10">
              <AlertTriangle className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No patients found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Inpatient ID</TableHead>
                      <TableHead>Outpatient ID</TableHead>
                      <TableHead>Contact Details</TableHead>
                      <TableHead>Discharge Report</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inpatients.map((patient) => (
                      <TableRow
                        key={patient.inpatient_id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>{patient.inpatient_id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {patient.outpatient_id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{patient.aadhaar_no}</p>
                            <p className="text-sm text-gray-500">
                              {patient.address}
                            </p>
                            <button
                              onClick={() =>
                                handleAddressClick(patient.address)
                              }
                              className="text-xs text-blue-500 flex items-center hover:text-blue-700"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              View Address
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => generatePdf(report)}
                          >
                            Download Report
                          </button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleViewDetails(patient.outpatient_id)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => handleDelete(patient.outpatient_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      )}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Patient Address</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-2">
            <p className="text-sm">{selectedAddress}</p>
            <div className="flex justify-end">
              <Button onClick={() => setShowAddressDialog(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PatientDetailsTable;
