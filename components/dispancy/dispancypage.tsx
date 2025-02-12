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

interface OPdetails {
  visit_id: number;
  name: string;
  age: number;
  gender: string;
}

interface Prescription {
  prescription_id: number;
  visit_id: number;
  medicine_id: number;
  dosage: string;
  dosage_type: string;
  dosage_timing: string;
  is_received: Boolean;
  patient_details: OPdetails;
}

export default function DispancyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [dispenseButton, setDispenseButton] = useState<boolean>(false);

  useEffect(() => {
    const fetchopdetails = async () => {
      setIsTableLoading(true);
      try {
        // Step 1: Fetch outpatientvisit data
        const response = await fetch("/api/outpatientvisit");
        const outpatientData = await response.json();

        // Step 2: Filter visits where medicine_dispensed is false
        const pendingVisits = outpatientData.filter(
          (visit: any) => !visit.medicine_dispensed
        );

        // Step 3: Check which pending visits have prescriptions
        const visitsWithPrescriptions = [];

        for (const visit of pendingVisits) {
          const prescriptionCheckResponse = await fetch(
            `/api/prescription/?visitId=${visit.visit_id}`
          );
          const prescriptionData = await prescriptionCheckResponse.json();

          if (prescriptionCheckResponse.ok && prescriptionData.length > 0) {
            // Add to the list if prescription exists
            const processedPrescriptions: Prescription[] = prescriptionData.map(
              (prescription: any) => {
                const patient = prescription.outpatient;

                return {
                  prescription_id: prescription.prescription_id,
                  visit_id: prescription.visit_id,
                  medicine_id: prescription.medicine_id,
                  dosage: prescription.dosage,
                  dosage_type: prescription.dosage_type,
                  dosage_timing: prescription.dosage_timing,
                  is_received: prescription.is_received,
                  patient_details: {
                    visit_id: prescription.visit_id,
                    name: patient.name,
                    age: patient.age,
                    gender: patient.gender,
                  },
                };
              }
            );
            setPrescriptions(processedPrescriptions);
            // visitsWithPrescriptions.push(visit);
          }
        }

        // Step 4: Set the state to display visits with pending medicines
        //setPendingTreatments(visitsWithPrescriptions);
      } catch (error) {
        console.log("Error occurred fetching OP details:", error);
      } finally {
        setIsTableLoading(false);
      }
    };

    fetchopdetails();
  }, []);

  const handleTreatmentClick = (visitId: number) => {
    setSelectedVisitId(selectedVisitId === visitId ? null : visitId);
  };
  const toggleReceivedStatus = (prescriptionId: number) => {
    setPrescriptions((prevPrescriptions) =>
      prevPrescriptions.map((prescription) =>
        prescription.prescription_id === prescriptionId
          ? {
              ...prescription,
              is_received: !prescription.is_received,
            }
          : prescription
      )
    );
  };
  const handlePrescriptionSubmit = async (visit_id: number) => {
    const updatedPrescriptions = prescriptions.filter(
      (p) => p.is_received || p.is_received === false
    );

    try {
      await Promise.all(
        updatedPrescriptions.map(async (prescription) => {
          await fetch(
            `/api/prescription/?prescriptionId=${prescription.prescription_id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ is_received: prescription.is_received }),
            }
          );
        })
      );
      for (const prescription of prescriptions) {
        if (prescription.is_received) {
          await fetch(`/api/medicine/?medicineId=${prescription.medicine_id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "reduceDosage",
              dosage: prescription.dosage,
            }),
          });
        }
      }
      setSelectedVisitId(null);
      setDispenseButton(true);
    } catch (error) {
      console.error("Error updating prescriptions:", error);
      alert("Failed to update prescriptions.");
    }
    try {
      const response = await fetch("/api/outpatientvisit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visit_id: visit_id,
          medicine_dispensed: true,
        }),
      });

      if (response.ok) {
        // Successfully updated, now remove pending treatments
        setPrescriptions((prev: any) =>
          prev.filter((visit: any) => visit.visit_id !== visit_id)
        );
      } else {
        console.error("Failed to update medicine_dispensed status");
      }
    } catch (error) {
      console.error("Error updating medicine_dispensed status:", error);
    }
  };
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Prescription Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by OP ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm mb-4"
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OP ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
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
              ) : prescriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                prescriptions
                  .filter(
                    (prescription, index, self) =>
                      index ===
                      self.findIndex(
                        (p) => p.visit_id === prescription.visit_id
                      )
                  ) // Unique visits
                  .filter((prescription) =>
                    prescription.visit_id
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) //For search by OP Id
                  .map((prescription) => (
                    <>
                      <TableRow key={prescription.visit_id}>
                        <TableCell>{prescription.visit_id}</TableCell>
                        <TableCell>
                          {prescription.patient_details.name}
                        </TableCell>
                        <TableCell>
                          {prescription.patient_details.age}
                        </TableCell>
                        <TableCell>
                          {prescription.patient_details.gender}
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              className={`px-4 py-2 rounded ${
                                dispenseButton ? "bg-green-500" : "bg-red-500"
                              } text-white`}
                              size="sm"
                              onClick={() =>
                                handleTreatmentClick(prescription.visit_id)
                              }
                            >
                              {dispenseButton
                                ? "Medicine Dispensed"
                                : " Dispense Medicine"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <Dialog
                        open={selectedVisitId === prescription.visit_id}
                        onOpenChange={() => setSelectedVisitId(null)}
                      >
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Medicines for Visit ID: {prescription.visit_id}
                            </DialogTitle>
                          </DialogHeader>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Medicine ID</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Timing</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {prescriptions
                                .filter(
                                  (p) => p.visit_id === prescription.visit_id
                                )
                                .map((med) => (
                                  <TableRow key={med.prescription_id}>
                                    <TableCell>{med.medicine_id}</TableCell>
                                    <TableCell>
                                      {med.dosage} {med.dosage_type}
                                    </TableCell>
                                    <TableCell>
                                      {med.dosage_timing.replace(
                                        " (Received)",
                                        ""
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div
                                        key={med.prescription_id}
                                        className="mb-4"
                                      >
                                        <Button
                                          onClick={() =>
                                            toggleReceivedStatus(
                                              med.prescription_id
                                            )
                                          }
                                          className={`px-4 py-2 rounded ${
                                            med.is_received
                                              ? "bg-green-500"
                                              : "bg-red-500"
                                          } text-white`}
                                        >
                                          {med.is_received
                                            ? "Received"
                                            : "Mark as Received"}
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                          <Button
                            onClick={() =>
                              handlePrescriptionSubmit(prescription.visit_id)
                            }
                            className="mt-4 bg-blue-500 text-white rounded-xl"
                          >
                            Submit Updates
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
