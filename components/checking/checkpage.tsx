"use client";
import React, { useState, useEffect } from "react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, ArrowRight, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";

interface Patient {
  id: number;
  visit_id: string;
  name: string;
  age: number;
  gender: string;
  cause: string;
}

interface Medication {
  type: string;
  subtype: string;
  dosageType: "child" | "adult";
  dosage: string;
  days: number;
  medicineId: number;
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
}

const CheckPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedMedicineType, setSelectedMedicineType] = useState<string>("");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const [isInpatientopen, setIsInpatientopen] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/medicine");
        const data = await response.json();
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
            id: patient.visit_id,
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

  const handleProceed = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPrescriptionOpen(true);
    setMedications([]);
    setLabTests([]);
    setDiagnosis("");
  };

  // const handleInpatients = (patient: Patient) => {
  //   setSelectedPatient(patient);
  //   setIsInpatientopen(true);
  // };

  const handleSubmitPrescription = async () => {
    if (!selectedPatient) return;

    for (const med of medications) {
      const medicine = medicines.find((m) => m.medicine_id === med.medicineId);
      if (medicine) {
        const currentStock = parseInt(medicine.stock_quantity);
        const usage = med.days * (med.dosageType === "child" ? 0.5 : 1);
        const newStock = currentStock - usage;

        await fetch("/api/medicine", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicine_id: med.medicineId,
            stock_quantity: newStock,
          }),
        });
      }
    }

    try {
      await fetch("/api/outpatientvisit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visit_id: selectedPatient.visit_id,
          diagnosis: diagnosis,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    } catch (error) {
      console.error("Error Adding diagnosis:", error);
    }

    const prescriptionData = {
      patientId: selectedPatient.id,
      diagnosis,
      medications,
      labTests,
    };

    console.log(prescriptionData);
    setIsPrescriptionOpen(false);
  };

  const handleAddMedication = () => {
    const selectedMedicine = medicines.find(
      (med) => med.medicine_id.toString() === selectedSubtype
    );
    if (!selectedMedicine) return;

    const dosageType =
      selectedPatient && selectedPatient.age < 12 ? "child" : "adult";

    setMedications([
      ...medications,
      {
        type: selectedMedicine.medicine_type,
        subtype: selectedMedicine.medicine_name,
        medicineId: selectedMedicine.medicine_id,
        dosageType,
        dosage: dosageType === "child" ? "1/2 tablet" : "1 tablet",
        days: 0,
      },
    ]);
  };

  const displayRemaining = (medicineId: string) => {
    const subtype = medicines.find(
      (sub) => sub.medicine_id.toString() === medicineId
    );
    return subtype?.stock_quantity || 0;
  };

  return (
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
                  patient.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProceed(patient)}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Refferal OP
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleProceed(patient)}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Convert Inpatient
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isPrescriptionOpen} onOpenChange={setIsPrescriptionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Prescription</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Diagnosis</Label>
              <Textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Medications</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedMedicineType}
                    onValueChange={setSelectedMedicineType}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Medicine Type" />
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
                    disabled={!selectedMedicineType}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select Medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines
                        .filter(
                          (med) => med.medicine_type === selectedMedicineType
                        )
                        .map((medicine) => (
                          <SelectItem
                            key={medicine.medicine_id}
                            value={medicine.medicine_id.toString()}
                          >
                            {medicine.medicine_name} (Stock:{" "}
                            {medicine.stock_quantity})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddMedication}
                    disabled={!selectedSubtype}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {medications.map((med, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-2 border rounded"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{med.subtype}</p>
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label>Tablets:</Label>
                      <Input
                        type="number"
                        value={med.days}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[index].days = parseInt(e.target.value);
                          setMedications(updated);
                        }}
                        className="w-20"
                      />
                    </div>
                    <p className="text-sm">
                      {med.dosage} ({med.dosageType})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {displayRemaining(med.medicineId.toString())}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Lab Tests</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setLabTests([...labTests, { name: "", description: "" }])
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {labTests.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-2 border rounded"
                >
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setLabTests(labTests.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPrescriptionOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitPrescription}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CheckPage;
