"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AddVisitPage from './addop';
import { Hospital, Plus, Eye, ArrowRight, Trash2, MoreHorizontal } from 'lucide-react';
import AddInpatientForm from './addip';
import { ScrollArea } from '@/components/ui/scroll-area';
import FollowUp from '@/app/follow_up/page';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

interface VisitHistory {
  visit_date: string;
  diagnosis: string;
  department: {
    department_name: string;
  } | null;
}

const FollowUpC = () => {
  const [inpatientVisits, setInpatientVisits] = useState<InpatientVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [labTests, setLabTests] = useState<{ name: string; description: string }[]>([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [advices, setAdvices] = useState(""); // Add this new state
  const [selectedPatient, setSelectedPatient] = useState<InpatientVisit | null>(null);
  const [selectedMedicineType, setSelectedMedicineType] = useState<string>("");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");
  const [visitHistory, setVisitHistory] = useState<VisitHistory[]>([]);

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

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("/api/medicine");
        const data = await response.json();
        setMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);

  const getMedicineTypes = () => {
    const types = Array.from(new Set(medicines.map((med) => med.medicine_type)));
    return types.map((type, index) => ({
      id: index + 1,
      name: type,
      medicines: medicines.filter((med) => med.medicine_type === type),
    }));
  };

  const handleProceed = async (patient: InpatientVisit) => {
    setSelectedPatient(patient);
    setIsPrescriptionOpen(true);
    setMedications([]);
    setLabTests([]);
    setDiagnosis("");

    try {
      const response = await fetch(`/api/oldvisit?outpatient_id=${patient.outpatient_id}`);
      const data = await response.json();
      setVisitHistory(data);
    } catch (error) {
      console.error("Error fetching visit history:", error);
      setVisitHistory([]);
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
      [field]: value as MedicationEntry[typeof field],
    };
    setMedications(updatedMedications);
  };

  const handleAddMedication = () => {
    const selectedMedicine = medicines.find(
      (med) => med.medicine_id.toString() === selectedSubtype
    );

    if (!selectedMedicine) return;

    const newMedication: MedicationEntry = {
      type: selectedMedicine.medicine_type,
      subtype: selectedMedicine.medicine_name,
      medicineId: selectedMedicine.medicine_id,
      category: "adult",
      dosageValue: "",
      dosageUnit: selectedMedicine.dosageUnit || "",
      dosageType: "",
      dosagetiming: "",
    };

    setMedications((prevMedications) => [...prevMedications, newMedication]);
  };

  const handleSubmitPrescription = async () => {
    if (!selectedPatient) return;

    try {
      for (const med of medications) {
        const prescriptionData = {
          medicine_id: med.medicineId,
          dosage: med.dosageValue,
          prescription_date: new Date(),
          dosage_timing: med.dosagetiming,
          dosage_type: med.dosageType,
          visit_id: null,
          inpatient_id : selectedPatient.inpatient_id,
        };

        const prescriptionResponse = await fetch("/api/prescription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prescriptionData),
        });

        if (!prescriptionResponse.ok) {
          throw new Error("Failed to save prescription");
        }
      }

      setIsPrescriptionOpen(false);
    } catch (error) {
      console.error("Error in prescription submission:", error);
    }
  };

  const filteredVisits = inpatientVisits.filter(visit =>
    Object.values(visit).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    visit.outpatient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="text-center mb-4">
        <Hospital className="h-8 w-8 mx-auto mb-2 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-700">Hospital Visits</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4 flex-col sm:flex-row justify-between">
            <Input
              type="text"
              placeholder="Search visits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Ward & Bed</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Attender Name</TableHead>
                  <TableHead>Attender Contact</TableHead>
                  <TableHead>Attender Ward</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => (
                    <TableRow key={visit.inpatient_id}>
                      <TableCell>{visit.outpatient.name}</TableCell>
                      <TableCell>{visit.outpatient.age}</TableCell>
                      <TableCell>{visit.outpatient.gender}</TableCell>
                      <TableCell>
                        Ward: {visit.ward_id}
                        <br />
                        <span className="text-xs text-gray-500">
                          Bed: {visit.bed_id}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(visit.admission_date).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-500">
                          {visit.admission_time}
                        </span>
                      </TableCell>
                      <TableCell>
                        {visit.attender_name}
                        <br />
                        <span className="text-xs text-gray-500">
                          {visit.attender_relationship}
                        </span>
                      </TableCell>
                      <TableCell>{visit.attender_contact_number}</TableCell>
                      <TableCell>
                        {visit.attender_ward_id && (
                          <>
                            Ward: {visit.attender_ward_id}
                            <br />
                            Bed: {visit.attender_bed_id}
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => console.log('View details:', visit.inpatient_id)}
                          >
                            View Follow Up
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleProceed(visit)}
                          >
                            Add Follow Up
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No Inpatients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPrescriptionOpen} onOpenChange={setIsPrescriptionOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-y-auto">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-1/3 border-r bg-muted/30 flex flex-col h-full overflow-hidden">
              {selectedPatient && (
                <div className="flex flex-col h-full">
                  {/* Patient Info */}
                  <div className="shrink-0 p-4 border-b bg-background/50">
                    <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                    <div className="bg-card rounded-lg p-4">
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-muted-foreground">Name</dt>
                          <dd className="text-sm font-medium">{selectedPatient.outpatient.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <dt className="text-sm text-muted-foreground">Age</dt>
                            <dd className="text-sm font-medium">{selectedPatient.outpatient.age}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Gender</dt>
                            <dd className="text-sm font-medium">{selectedPatient.outpatient.gender}</dd>
                          </div>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Visit History */}
                  <div className="flex-1 min-h-0">
                    <div className="p-4 h-full flex flex-col">
                      <h3 className="text-lg font-semibold mb-4 shrink-0">Visit History</h3>
                      <div className="relative flex-1">
                        <ScrollArea className="h-[calc(100vh-400px)] w-full rounded-md border">
                          <div className="p-4 space-y-3">
                            {visitHistory && visitHistory.length > 0 ? (
                              visitHistory.map((visit, index) => (
                                <div key={index} className="bg-card rounded-lg p-4 border">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <p className="text-sm font-semibold">
                                        {new Date(visit.visit_date).toLocaleDateString()}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {visit.department?.department_name || "No department"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <p className="text-sm font-medium">Diagnosis:</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {visit.diagnosis || "No diagnosis recorded"}
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
                    <TabsTrigger value="diagnosis">Diagnosis & Observation</TabsTrigger>
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
                      <div className="space-y-2">
                        <Label>Advices</Label>
                        <Textarea
                          value={advices}
                          onChange={(e) => setAdvices(e.target.value)}
                          placeholder="Enter advices for the patient"
                          className="min-h-[200px]"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medications" className="flex-1 overflow-hidden">
                    <div className="space-y-4 h-full flex flex-col overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Select value={selectedMedicineType} onValueChange={setSelectedMedicineType}>
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

                          <Select value={selectedSubtype} onValueChange={setSelectedSubtype}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Medicine" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicines
                                .filter((med) => med.medicine_type === selectedMedicineType)
                                .map((medicine) => (
                                  <SelectItem key={medicine.medicine_id} value={medicine.medicine_id.toString()}>
                                    {medicine.medicine_name} ({medicine.stock_quantity})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          <Button variant="secondary" size="sm" onClick={handleAddMedication}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>

                      <ScrollArea className="flex-1 border rounded-lg">
                        <div className="p-4 space-y-4">
                          {medications.map((med, index) => (
                            <div key={index} className="bg-card rounded-lg border p-4">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="font-medium">{med.subtype}</h4>
                                  <p className="text-sm text-muted-foreground">{med.type}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setMedications(medications.filter((_, i) => i !== index))}>
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
                                      onChange={(e) => handleMedicationChange(index, "dosageValue", e.target.value)}
                                    />
                                    <span className="text-sm font-medium whitespace-nowrap">{med.dosageUnit}</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm">Type</Label>
                                  <Select value={med.dosageType} onValueChange={(value) => handleMedicationChange(index, "dosageType", value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="internal">Internal</SelectItem>
                                      <SelectItem value="external">External</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="col-span-2">
                                  <Label className="text-sm">Timing</Label>
                                  <Select value={med.dosagetiming} onValueChange={(value) => handleMedicationChange(index, "dosagetiming", value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select timing" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="bid">BID (2 Times per Day)</SelectItem>
                                      <SelectItem value="tds">TDS (3 Times per Day)</SelectItem>
                                      <SelectItem value="od">OD (1 Time per Day)</SelectItem>
                                      <SelectItem value="sos">SOS (If needed)</SelectItem>
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
                      <Button variant="outline" size="sm" onClick={() => setLabTests([...labTests, { name: "", description: "" }])}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test
                      </Button>

                      <ScrollArea className="h-[400px] border rounded-lg p-4">
                        <div className="space-y-4">
                          {labTests.map((test, index) => (
                            <div key={index} className="bg-card rounded-lg border p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Test Details</Label>
                                <Button variant="ghost" size="sm" onClick={() => setLabTests(labTests.filter((_, i) => i !== index))}>
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
                <Button variant="outline" onClick={() => setIsPrescriptionOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitPrescription}>Save Treatment</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpC;