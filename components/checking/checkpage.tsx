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
import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { useForm } from "react-hook-form";
import { set } from "date-fns";

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
  dosageUnit: string;
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

    for (const med of medications) {
      const medicine = medicines.find((m) => m.medicine_id === med.medicineId);
      if (medicine) {
        const currentStock = parseInt(medicine.stock_quantity);
        const usage = med.category === "child" ? 0.5 : 1;
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
      // dosagevalue,
      // dosageUnit,
      // dosageType,
      // dosagetiming,
    };

    console.log(prescriptionData);
    setIsPrescriptionOpen(false);
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
      category: category,
      dosageValue: "",
      dosageUnit: selectedMedicine.dosageUnit || "",
      dosageType: "",
      dosagetiming: "",
    };

    setMedications((prevMedications) => {
      const updatedMedications = [...prevMedications, newMedication];
      console.log(updatedMedications);
      return updatedMedications;
    });
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

  const updateDosageTiming = (index: number, value: string) => {
    setMedicines((prevMedicines) =>
      prevMedicines.map((med, i) =>
        i === index ? { ...med, dosagetiming: value } : med
      )
    );
  };
  const updateMedicineField = (
    index: number,
    field: keyof Medicine,
    value: string
  ) => {
    setMedicines((prevMedicines) =>
      prevMedicines.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    );
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
                          onClick={() => handleInpatients(patient)}
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
                    <div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          // onChange={(e) => {
                          //   const updated = [...medications];
                          //   updated[index].dosageValue = e.target.value;
                          //   setMedications(updated);
                          // }}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "dosageValue",
                              e.target.value
                            )
                          }
                          className="w-20"
                          value={med.dosageValue}
                        />
                        <p className="text-sm text-bold">
                          <b>{med.dosageUnit}</b>
                        </p>
                        <Select
                          value={med.dosagetiming}
                          onValueChange={(value) =>
                            handleMedicationChange(index, "dosagetiming", value)
                          }
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Dosage Timing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bid">
                              BID
                              <p className="text-sm text-muted-foreground">
                                (2 Times per Day)
                              </p>
                            </SelectItem>
                            <SelectItem value="tds">
                              TDS
                              <p className="text-sm text-muted-foreground">
                                (3 Times per Day)
                              </p>
                            </SelectItem>
                            <SelectItem value="od">
                              OD{" "}
                              <p className="text-sm text-muted-foreground">
                                (1 Time per Day)
                              </p>
                            </SelectItem>
                            <SelectItem value="sos">
                              SOS
                              <p className="text-sm text-muted-foreground">
                                (If needed)
                              </p>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      {["CHOORANAM", "THAILAM"].includes(med.type) ? (
                        <Select
                          value={med.dosageType}
                          onValueChange={(value) =>
                            handleMedicationChange(index, "dosageType", value)
                          }
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Dosage Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : null}
                    </div>
                    <p className="text-md">
                      Age-category: <b>{med.category}</b>
                    </p>
                    {/* <p className="text-sm text-muted-foreground">
                      Stock: {displayRemaining(med.medicineId.toString())}
                    </p> */}
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

      <Dialog open={isInpatientopen} onOpenChange={setIsInpatientopen}>
        <DialogContent>
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

          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleInpatientSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CheckPage;
