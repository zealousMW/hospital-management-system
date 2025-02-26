"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import AddVisitPage from "./addop";
import { Hospital, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface OutpatientVisit {
  visit_id: number;
  name: string;
  age: number;
  gender: string;
  date_of_visit: string;
  department: string;
  status: "active" | "completed" | "cancelled";
}

const Visitstable = () => {
  const [outpatientVisits, setOutpatientVisits] = useState<OutpatientVisit[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScreening, setIsScreening] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isScreening');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Save to localStorage when isScreening changes
  useEffect(() => {
    localStorage.setItem('isScreening', JSON.stringify(isScreening));
  }, [isScreening]);

  const fetchVisitsData = async () => {
    try {
      const response = await fetch("/api/visits");
      if (!response.ok) throw new Error("Failed to fetch visits");
      const data = await response.json();
      setOutpatientVisits(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitsData();
  }, []);

  const filteredVisits = outpatientVisits.filter((visit) =>
    Object.values(visit).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
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
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Search visits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isScreening}
                  onCheckedChange={setIsScreening}
                  id="screening-mode"
                />
                <Label htmlFor="screening-mode">OP Screening</Label>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New OutPatient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Add OutPatient</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[80vh]">
                  <AddVisitPage isScreening={isScreening} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visit ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => (
                    <TableRow key={visit.visit_id}>
                      <TableCell>{visit.visit_id}</TableCell>
                      <TableCell>{visit.name}</TableCell>
                      <TableCell>{visit.age}</TableCell>
                      <TableCell>{visit.department}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              console.log("View details:", visit.visit_id)
                            }
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              console.log(
                                "Convert to inpatient:",
                                visit.visit_id
                              )
                            }
                          >
                            Convert
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No Outpatient today
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Visitstable;
