"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PhoneIcon, MapPinIcon, CheckCircleIcon, XCircleIcon, EditIcon, PlusCircleIcon, Stethoscope } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Department {
  department_id: number;
  department_name: string;
  department_type: string;
  description: string;
}

const departmentTypes = [
  { id: 1, name: "UG" },
  { id: 2, name: "PG" },
  { id: 3, name: "special" },
];

export default function Department() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    department_name: "",
    department_type: "",
    description: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departmentApi');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/departmentApi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDepartment),
      });

      if (response.ok) {
        fetchDepartments();
        setIsDialogOpen(false);
        setNewDepartment({
          department_name: "",
          department_type: "",
          description: "",
        });
      }
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const updateData = {
        department_id: id,
        department_name: "Updated Department",
        department_type: "Updated Type",
        description: "Updated description"
      };

      const response = await fetch('/api/departmentApi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        fetchDepartments();
      }
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hospital Departments</h1>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-green-500 hover:bg-green-600">
            <PlusCircleIcon className="mr-2 w-5 h-5" /> Add New Department
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={newDepartment.department_name}
                onChange={(e) => setNewDepartment({
                  ...newDepartment,
                  department_name: e.target.value
                })}
              />
            </div>
            <div>
              <Label htmlFor="type">Department Type</Label>
              <Select
                value={newDepartment.department_type}
                onValueChange={(value) => setNewDepartment({
                  ...newDepartment,
                  department_type: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {departmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({
                  ...newDepartment,
                  description: e.target.value
                })}
              />
            </div>
            <Button onClick={handleAdd} className="w-full">
              Add Department
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="shadow-lg">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department ID</TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead>Department Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.department_id}>
                  <TableCell>{dept.department_id}</TableCell>
                  <TableCell>{dept.department_name}</TableCell>
                  <TableCell>{dept.department_type}</TableCell>
                  <TableCell>{dept.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(dept.department_id)}
                      >
                        <EditIcon className="w-4 h-4" />
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
