"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, ArrowRight, Plus, Trash2, MoreHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { set } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Patient {
  id: number;
  visit_id: string;
  name: string;
  age: number;
  gender: string;
  cause: string;
}

interface LabTest {
  name: string;
  description: string;
}

interface Medicine {
  medicine_id: number;
  medicine_name: string;
  medicine_type: string;
  stock_quantity: string;
  dosageUnit: string; // Single field for units
}

interface MedicationEntry {
  type: string;
  subtype: string;
  medicineId: number;
  category: string;
  dosageValue: string;
  dosageUnit: string;
  dosageType: string;
  dosagetiming: string;
}

// Update the VisitHistory interface
interface VisitHistory {
  visit_date: string;
  diagnosis: string;
  department: {
    department_name: string;
  } | null; // Make department optional since it might be null
}

const CheckPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedMedicineType, setSelectedMedicineType] = useState<string>("");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const [isInpatientopen, setIsInpatientopen] = useState(false);
  const [visitHistory, setVisitHistory] = useState<VisitHistory[]>([]);
  //const [Inpatient, setInpatient] = useState<InPatient[]>([]);
  const outpatientIdRef = useRef<HTMLInputElement>(null);
  const [opdetails, setOpdetails] = useState({
    outpatient_id: "",
    name: "",
    age: "",
    gender: "",
    number: "",
    place: "",
  });
  const [inpatientData, setInpatientData] = useState({
    aadhaar_no: "",
    address: "",
    ward_no: "",
    bed_no: "",
    discharge_date: "",
  });

  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/medicine");
        const data = await response.json();
        console.log("Fetched medicines:", data); // Debug log
        setMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsTableLoading(true);
      try {
        const department_id = searchParams.get("department_id");
        const response = await fetch(
          `/api/check/?department_id=${department_id}`
        );
        const data = await response.json();
        setPatients(
          data.map((patient: any) => ({
            id: patient.outpatient_id,
            visit_id: patient.visit_id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            cause: patient.cause_of_visit,
          }))
        );
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsTableLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getMedicineTypes = () => {
    const types = Array.from(
      new Set(medicines.map((med) => med.medicine_type))
    );
    return types.map((type, index) => ({
      id: index + 1,
      name: type,
      medicines: medicines.filter((med) => med.medicine_type === type),
    }));
  };

  // Update the handleProceed function
  const handleProceed = async (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPrescriptionOpen(true);
    setMedications([]);
    setLabTests([]);
    setDiagnosis("");

    try {
      const response = await fetch(`/api/oldvisit?outpatient_id=${patient.id}`);
      const data = await response.json();
      //console.log('Visit history response:', data); // Add this debug log
      setVisitHistory(data);
    } catch (error) {
      console.error("Error fetching visit history:", error);
      setVisitHistory([]); // Set empty array on error
    }
  };

  const handleMedicationChange = (
    index: number,
    field: keyof MedicationEntry,
    value: string
  ) => {
    const updatedMedications = [...medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value as MedicationEntry[typeof field], // Type Assertion Fix
    };
    setMedications(updatedMedications);
  };

  const handleChange = (e: any) => {
    setInpatientData({ ...inpatientData, [e.target.name]: e.target.value });
  };

  const handleInpatients = async (patient: Patient) => {
    setSelectedPatient(patient);
    console.log(patient.id);
    try {
      const response = await fetch(
        `api/singleoutpatient/?outpatientvisit_id=${patient.id}`
      );
      const data = await response.json();
      setOpdetails(data[0].outpatient);
      setIsInpatientopen(true);
    } catch (error) {
      console.log("Error occured in Fetching patient data:", error);
    }
  };

  const handleSubmitPrescription = async () => {
    if (!selectedPatient) return;

    try {
      // Update diagnosis first
      const diagnosisResponse = await fetch("/api/outpatientvisit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visit_id: selectedPatient.visit_id,
          diagnosis: diagnosis,
        }),
      });

      if (!diagnosisResponse.ok) {
        throw new Error("Failed to update diagnosis");
      }

      // Prepare prescription data
      const prescriptionData = {
        medicine_ids: medications.map((med) => med.medicineId),
        dosage: medications.map((med) => med.dosageValue),
        prescription_date: new Date(),
        dosage_timing: medications.map((med) => med.dosagetiming),
        dosage_type: medications.map((med) => med.dosageType),
        visit_id: selectedPatient.visit_id,
      };
      // Submit prescription
      const prescriptionResponse = await fetch("/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData),
      });

      if (!prescriptionResponse.ok) {
        const error = await prescriptionResponse.json();
        throw new Error(error.error || "Failed to save prescription");
      }

      // Update medicine stock after successful prescription
      // await Promise.all(
      //   medications.map(async (med) => {
      //     const medicine = medicines.find(
      //       (m) => m.medicine_id === med.medicineId
      //     );
      //     if (medicine) {
      //       const currentStock = parseInt(medicine.stock_quantity);
      //       const usage = med.category === "child" ? 0.5 : 1;
      //       const newStock = currentStock - usage;

      //       const stockResponse = await fetch("/api/medicine", {
      //         method: "PUT",
      //         headers: { "Content-Type": "application/json" },
      //         body: JSON.stringify({
      //           medicine_id: med.medicineId,
      //           stock_quantity: newStock,
      //         }),
      //       });

      //       if (!stockResponse.ok) {
      //         throw new Error(`Failed to update stock for ${med.subtype}`);
      //       }
      //     }
      //   })
      // );

      setIsPrescriptionOpen(false);
      // Optionally refresh the patient list or show success message
    } catch (error) {
      console.error("Error in prescription submission:", error);
      // You might want to show an error message to the user
    }
  };

  const handleAddMedication = () => {
    const selectedMedicine = medicines.find(
      (med) => med.medicine_id.toString() === selectedSubtype
    );

    if (!selectedMedicine) return;

    const category =
      selectedPatient && selectedPatient.age < 12 ? "child" : "adult";

    const newMedication: MedicationEntry = {
      type: selectedMedicine.medicine_type,
      subtype: selectedMedicine.medicine_name,
      medicineId: selectedMedicine.medicine_id,
      category,
      dosageValue: "",
      dosageUnit: selectedMedicine.dosageUnit || "",
      dosageType: "",
      dosagetiming: "",
    };

    setMedications((prevMedications) => [...prevMedications, newMedication]);
  };

  const displayRemaining = (medicineId: string) => {
    const subtype = medicines.find(
      (sub) => sub.medicine_id.toString() === medicineId
    );
    return subtype?.stock_quantity || 0;
  };

  const handleInpatientSubmit = async (e: any) => {
    e.preventDefault();
    console.log(inpatientData);
    if (!outpatientIdRef.current) {
      console.log("Ref is not attached");
      return;
    }
    const outpatient_id = outpatientIdRef.current.value;
    const data = { outpatient_id, ...inpatientData };
    try {
      await fetch("/api/inpatientapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outpatient_id: data.outpatient_id,
          aadhaar_no: data.aadhaar_no,
          address: data.address,
          ward_no: data.ward_no,
          bed_no: data.bed_no,
          discharge_date: data.discharge_date,
        }),
      })
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log("Error occured in Create inpatient data:", error);
    }
    outpatientIdRef.current.value = "";
    setPatients([]);
    setInpatientData({
      aadhaar_no: "",
      address: "",
      ward_no: "",
      bed_no: "",
      discharge_date: "",
    });
    setIsInpatientopen(false);
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm mb-4"
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading patients...
                  </TableCell>
                </TableRow>
              ) : patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                patients
                  .filter((patient) =>
                    patient.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.visit_id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.cause}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleProceed(patient)}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Treatment
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleProceed(patient)}
                              >
                                Referral OP
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleInpatients(patient)}
                              >
                                Convert Inpatient
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isPrescriptionOpen} onOpenChange={setIsPrescriptionOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-y-auto">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-1/3 border-r bg-muted/30 flex flex-col h-full overflow-hidden">
              {selectedPatient && (
                <div className="flex flex-col h-full">
                  {/* Patient Info - Fixed Height */}
                  <div className="shrink-0 p-4 border-b bg-background/50">
                    <h3 className="text-lg font-semibold mb-4">
                      Patient Information
                    </h3>
                    <div className="bg-card rounded-lg p-4">
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-muted-foreground">
                            Visit ID
                          </dt>
                          <dd className="text-sm font-medium">
                            {selectedPatient.visit_id}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">
                            Name
                          </dt>
                          <dd className="text-sm font-medium">
                            {selectedPatient.name}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <dt className="text-sm text-muted-foreground">
                              Age
                            </dt>
                            <dd className="text-sm font-medium">
                              {selectedPatient.age}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">
                              Gender
                            </dt>
                            <dd className="text-sm font-medium">
                              {selectedPatient.gender}
                            </dd>
                          </div>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">
                            Cause
                          </dt>
                          <dd className="text-sm font-medium">
                            {selectedPatient.cause}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Visit History - Scrollable */}
                  <div className="flex-1 min-h-0">
                    <div className="p-4 h-full flex flex-col">
                      <h3 className="text-lg font-semibold mb-4 shrink-0">
                        Visit History
                      </h3>
                      <div className="relative flex-1">
                        <ScrollArea className="h-[calc(100vh-400px)] w-full rounded-md border">
                          <div className="p-4 space-y-3">
                            {visitHistory && visitHistory.length > 0 ? (
                              visitHistory.map((visit, index) => (
                                <div
                                  key={index}
                                  className="bg-card rounded-lg p-4 border"
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <p className="text-sm font-semibold">
                                        {new Date(
                                          visit.visit_date
                                        ).toLocaleDateString()}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {visit.department?.department_name ||
                                          "No department"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <p className="text-sm font-medium">
                                      Diagnosis:
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {visit.diagnosis ||
                                        "No diagnosis recorded"}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center text-muted-foreground py-4">
                                No previous visits found
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>Treatment Details</DialogTitle>
              </DialogHeader>

              <div className="flex-1 px-6 pb-6">
                <Tabs defaultValue="diagnosis" className="h-full flex flex-col">
                  <TabsList className="mb-4">
                    <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="lab">Lab Tests</TabsTrigger>
                  </TabsList>

                  <TabsContent value="diagnosis" className="flex-1">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Current Diagnosis</Label>
                        <Textarea
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          placeholder="Enter diagnosis details"
                          className="min-h-[200px]"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="medications"
                    className="flex-1 overflow-hidden"
                  >
                    <div className="space-y-4 h-full flex flex-col overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Select
                            value={selectedMedicineType}
                            onValueChange={setSelectedMedicineType}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMedicineTypes().map((type) => (
                                <SelectItem key={type.id} value={type.name}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={selectedSubtype}
                            onValueChange={setSelectedSubtype}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Medicine" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicines
                                .filter(
                                  (med) =>
                                    med.medicine_type === selectedMedicineType
                                )
                                .map((medicine) => (
                                  <SelectItem
                                    key={medicine.medicine_id}
                                    value={medicine.medicine_id.toString()}
                                  >
                                    {medicine.medicine_name} (
                                    {medicine.stock_quantity})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleAddMedication}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>

                      <ScrollArea className="flex-1 border rounded-lg">
                        <div className="p-4 space-y-4">
                          {medications.map((med, index) => (
                            <div
                              key={index}
                              className="bg-card rounded-lg border p-4"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="font-medium">{med.subtype}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {med.type}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setMedications(
                                      medications.filter((_, i) => i !== index)
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm">Dosage</Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      className="w-20"
                                      value={med.dosageValue}
                                      onChange={(e) =>
                                        handleMedicationChange(
                                          index,
                                          "dosageValue",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <span className="text-sm font-medium whitespace-nowrap">
                                      {med.dosageUnit}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm">Type</Label>
                                  <Select
                                    value={med.dosageType}
                                    onValueChange={(value) =>
                                      handleMedicationChange(
                                        index,
                                        "dosageType",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="internal">
                                        Internal
                                      </SelectItem>
                                      <SelectItem value="external">
                                        External
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="col-span-2">
                                  <Label className="text-sm">Timing</Label>
                                  <Select
                                    value={med.dosagetiming}
                                    onValueChange={(value) =>
                                      handleMedicationChange(
                                        index,
                                        "dosagetiming",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select timing" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="bid">
                                        BID (2 Times per Day)
                                      </SelectItem>
                                      <SelectItem value="tds">
                                        TDS (3 Times per Day)
                                      </SelectItem>
                                      <SelectItem value="od">
                                        OD (1 Time per Day)
                                      </SelectItem>
                                      <SelectItem value="sos">
                                        SOS (If needed)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="lab" className="flex-1 overflow-hidden">
                    <div className="space-y-4 overflow-y-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setLabTests([
                            ...labTests,
                            { name: "", description: "" },
                          ])
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test
                      </Button>

                      <ScrollArea className="h-[400px] border rounded-lg p-4">
                        <div className="space-y-4">
                          {labTests.map((test, index) => (
                            <div
                              key={index}
                              className="bg-card rounded-lg border p-4 space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Test Details</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setLabTests(
                                      labTests.filter((_, i) => i !== index)
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid gap-4">
                                <Input
                                  placeholder="Test Name"
                                  value={test.name}
                                  onChange={(e) => {
                                    const updated = [...labTests];
                                    updated[index].name = e.target.value;
                                    setLabTests(updated);
                                  }}
                                />
                                <Input
                                  placeholder="Description"
                                  value={test.description}
                                  onChange={(e) => {
                                    const updated = [...labTests];
                                    updated[index].description = e.target.value;
                                    setLabTests(updated);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="border-t p-4 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsPrescriptionOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitPrescription}>
                  Save Treatment
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isInpatientopen} onOpenChange={setIsInpatientopen}>
        <DialogContent>
          <ScrollArea className="h-[400px]">
            <DialogHeader>
              <DialogTitle>Convert as Inpatient</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="outpatient_id">Outpatient ID</Label>
                <Input
                  type="text"
                  value={opdetails.outpatient_id}
                  name="outpatient_id"
                  ref={outpatientIdRef}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="aadhaar_no">Aadhaar Number *</Label>
                <Input
                  type="text"
                  name="aadhaar_no"
                  value={inpatientData.aadhaar_no}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  type="text"
                  name="address"
                  value={inpatientData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ward_no">Ward Number *</Label>
                <Input
                  type="text"
                  name="ward_no"
                  value={inpatientData.ward_no}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bed_no">Bed Number *</Label>
                <Input
                  type="text"
                  name="bed_no"
                  value={inpatientData.bed_no}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="discharge_date">Discharge Date *</Label>
                <Input
                  type="date"
                  name="discharge_date"
                  value={inpatientData.discharge_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </form>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleInpatientSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckPage;
