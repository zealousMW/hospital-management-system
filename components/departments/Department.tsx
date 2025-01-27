"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PhoneIcon, MapPinIcon, CheckCircleIcon, XCircleIcon, EditIcon, TrashIcon, PlusCircleIcon, Stethoscope } from "lucide-react";

const initialDepartments = [
  { id: 1, name: "Cardiology",doctor:"Joe", location: "2nd Floor, Block A", extension: "1234", status: "Active", action: "Performing patient consultations" },
  { id: 2, name: "Neurology",doctor:"Smith", location: "3rd Floor, Block B", extension: "5678", status: "Inactive", action: "Under maintenance" },
  { id: 3, name: "Pediatrics",doctor:"Kane", location: "1st Floor, Block C", extension: "9101", status: "Active", action: "Vaccination drives ongoing" },
  { id: 4, name: "Orthopedics",doctor:"William", location: "Ground Floor, Block D", extension: "1121", status: "Active", action: "Fracture treatments and surgeries" },
];

export default function Department() {

    const [departments, setDepartments] = useState(initialDepartments);

    const handleEdit = (id:Number) => {

        console.log(`Edit department with ID: ${id}`);
        // Add logic for editing department
      };
    
      const handleDelete = (id:Number) => {
        console.log(`Delete department with ID: ${id}`);
        // Add logic for deleting department
      };

      const handleAdd = () => {
        const newDepartment = {
          id: departments.length + 1,
          name: "New Department",
          doctor:"New",
          location: "TBD",
          extension: "0000",
          status: "Active",
          action: "TBD",
        };
        setDepartments([...departments, newDepartment]);
      };
    
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hospital Departments</h1>
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600"
        onClick={handleAdd}
      >
        <PlusCircleIcon className="mr-2 w-5 h-5" /> Add New Department
      </button>
      <Card className="shadow-lg">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department ID</TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Primary Doctor</TableHead>
                <TableHead>Extension</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.id}</TableCell>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 w-4 h-4" /> {dept.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Stethoscope className="mr-2 w-4 h-4" /> {dept.doctor}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <PhoneIcon className="mr-2 w-4 h-4" /> {dept.extension}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {dept.status === "Active" ? (
                        <CheckCircleIcon className="mr-2 w-4 h-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="mr-2 w-4 h-4 text-red-500" />
                      )}
                      {dept.status}
                    </div>
                  </TableCell>
                  <TableCell>{dept.action}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(dept.id)}
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(dept.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
