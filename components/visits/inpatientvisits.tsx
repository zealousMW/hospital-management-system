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
import AddVisitPage from "./addvisits";
import { Hospital, Plus } from "lucide-react";

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
    // <div className="container mx-auto px-4 py-4">
    //   <div className="text-center mb-4">
    //     <Hospital className="h-8 w-8 mx-auto mb-2 text-blue-500" />
    //     <h1 className="text-2xl font-bold text-gray-700">Hospital Visits</h1>
    //   </div>

    //   <Card>
    //     <CardHeader>
    //       <div className="flex gap-4 flex-col sm:flex-row justify-between">
    //         <Input
    //           type="text"
    //           placeholder="Search visits..."
    //           value={searchTerm}
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //           className="max-w-sm"
    //         />
    //         <Dialog>
    //           <DialogTrigger asChild>
    //             <Button>
    //               <Plus className="h-4 w-4 mr-2" />
    //               New OutPatient
    //             </Button>
    //           </DialogTrigger>
    //           <DialogContent className="max-h-[90vh]">
    //             <DialogHeader>
    //               <DialogTitle>Add OutPatient</DialogTitle>
    //             </DialogHeader>
    //             <ScrollArea className="h-[80vh]">
    //               <AddVisitPage />
    //             </ScrollArea>
    //           </DialogContent>
    //         </Dialog>
    //       </div>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="rounded-md border">
    //         <Table>
    //           <TableHeader>
    //             <TableRow>
    //               <TableHead>Visit ID</TableHead>
    //               <TableHead>Patient Name</TableHead>
    //               <TableHead>Age</TableHead>
    //               <TableHead>Department</TableHead>
    //               <TableHead>Actions</TableHead>
    //             </TableRow>
    //           </TableHeader>
    //           <TableBody>
    //             {filteredVisits.length > 0 ? (
    //               filteredVisits.map((visit) => (
    //                 <TableRow key={visit.visit_id}>
    //                   <TableCell>{visit.visit_id}</TableCell>
    //                   <TableCell>{visit.name}</TableCell>
    //                   <TableCell>{visit.age}</TableCell>
    //                   <TableCell>{visit.department}</TableCell>
    //                   <TableCell>
    //                     <div className="flex gap-2">
    //                       <Button
    //                         variant="outline"
    //                         size="sm"
    //                         onClick={() =>
    //                           console.log("View details:", visit.visit_id)
    //                         }
    //                       >
    //                         View
    //                       </Button>
    //                       <Button
    //                         variant="outline"
    //                         size="sm"
    //                         onClick={() =>
    //                           console.log(
    //                             "Convert to inpatient:",
    //                             visit.visit_id
    //                           )
    //                         }
    //                       >
    //                         Convert
    //                       </Button>
    //                     </div>
    //                   </TableCell>
    //                 </TableRow>
    //               ))
    //             ) : (
    //               <TableRow>
    //                 <TableCell colSpan={5} className="text-center">
    //                   No Outpatient today
    //                 </TableCell>
    //               </TableRow>
    //             )}
    //           </TableBody>
    //         </Table>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
    <div className="container mx-auto px-4 py-4 bg-gradient-to-br from-green-100 via-green-200 to-green-300 rounded-xl shadow-lg">
      <div className="text-center mb-4">
        <Hospital className="h-8 w-8 mx-auto mb-2 text-green-600" />
        <h1 className="text-2xl font-bold text-green-800">Hospital Visits</h1>
      </div>

      <Card className="bg-gradient-to-br from-green-200 via-green-300 to-green-400 text-gray-900 shadow-md">
        <CardHeader>
          <div className="flex gap-4 flex-col sm:flex-row justify-between items-center">
            <Input
              type="text"
              placeholder="Search visits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-green-400 focus:border-green-600 focus:ring-green-500"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white shadow-md flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New OutPatient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] bg-gradient-to-b from-green-100 to-green-300">
                <DialogHeader>
                  <DialogTitle className="text-green-800">
                    Add OutPatient
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[80vh]">
                  <AddVisitPage />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-green-300 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-100 text-green-800">
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
                    <TableRow
                      key={visit.visit_id}
                      className="hover:bg-green-50"
                    >
                      <TableCell>{visit.visit_id}</TableCell>
                      <TableCell>{visit.name}</TableCell>
                      <TableCell>{visit.age}</TableCell>
                      <TableCell>{visit.department}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-400 text-green-700 hover:bg-green-100"
                            onClick={() =>
                              console.log("View details:", visit.visit_id)
                            }
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-400 text-green-700 hover:bg-green-100"
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
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500"
                    >
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
