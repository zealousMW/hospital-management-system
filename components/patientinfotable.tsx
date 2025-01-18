"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // ShadCN Table
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // ShadCN Dialog

interface Patient {
  id: number;
  name: string;
  phone: string;
  gender: string;
  age: number;
  address: string;
  diagnosis: string;
}

const PatientTable = () => {
  // Simulated patient data
  const data: Patient[] = [
    { id: 1, name: "Ramesh", phone: "1234567890", gender: "Male", age: 30, address: "Chennai", diagnosis: "Fever" },
    { id: 2, name: "Suresh", phone: "1234567890", gender: "Male", age: 40, address: "Coimbatore", diagnosis: "Diabetes" },
    { id: 3, name: "Geetha", phone: "9876543210", gender: "Female", age: 28, address: "Madurai", diagnosis: "Migraine" },
    { id: 4, name: "Ramesh", phone: "9876543210", gender: "Male", age: 35, address: "Tirunelveli", diagnosis: "Hypertension" },
    { id: 5, name: "Vimala", phone: "1234567890", gender: "Female", age: 50, address: "Salem", diagnosis: "Arthritis" },
  ];

  // State for search inputs
  const [phoneQuery, setPhoneQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");

  // State for the selected patient (for the modal)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Filtered data based on user input
  const filteredData = useMemo(() => {
    return data.filter((patient) => {
      return (
        patient.phone.includes(phoneQuery) &&
        patient.name.toLowerCase().includes(nameQuery.toLowerCase())
      );
    });
  }, [phoneQuery, nameQuery]);

  // Define table columns
  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "age",
      header: "Age",
    },
  ];

  // React Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      {/* Search Inputs */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by phone number..."
          value={phoneQuery}
          onChange={(e) => setPhoneQuery(e.target.value)}
          className="w-1/2"
        />
        <Input
          placeholder="Search by name..."
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          className="w-1/2"
        />
      </div>

      {/* Data Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedPatient(row.original)} // Set selected patient
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <Dialog open={true} onOpenChange={() => setSelectedPatient(null)} >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>ID:</strong> {selectedPatient.id}</p>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Phone:</strong> {selectedPatient.phone}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p><strong>Diagnosis:</strong> {selectedPatient.diagnosis}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PatientTable;
