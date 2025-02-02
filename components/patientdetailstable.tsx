"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Users2, MoreHorizontal, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.";

interface Patient {
  patient_id: number;
  first_name: string;
  last_name: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  has_allergy: boolean;
  has_disease: boolean;
  is_child: boolean;
  parent_guardian_name?: string;
  parent_guardian_contact?: string;
  parent_guardian_email?: string;
}

const PatientDetailsTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockPatients: Patient[] = [
      {
        patient_id: 1,
        first_name: "John",
        last_name: "Doe",
        date_of_birth: "1990-05-15",
        gender: "Male",
        contact_number: "+1234567890",
        email: "john.doe@email.com",
        address: "123 Main St",
        registration_date: "2024-01-20",
        blood_type: "O+",
        emergency_contact_name: "Jane Doe",
        emergency_contact_number: "+1987654321",
        has_allergy: true,
        has_disease: false,
        is_child: false
      },
      {
        patient_id: 2,
        first_name: "Sarah",
        last_name: "Smith",
        date_of_birth: "2015-03-10",
        gender: "Female",
        contact_number: "+1234567891",
        email: "",
        address: "456 Oak St",
        registration_date: "2024-01-21",
        blood_type: "A+",
        emergency_contact_name: "Mike Smith",
        emergency_contact_number: "+1987654322",
        has_allergy: false,
        has_disease: true,
        is_child: true,
        parent_guardian_name: "Mike Smith",
        parent_guardian_contact: "+1987654322",
        parent_guardian_email: "mike.smith@email.com"
      }
    ];

    setPatients(mockPatients);
    setLoading(false);
  }, []);

  const filteredPatients = patients.filter(patient => 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact_number.includes(searchTerm)
  );

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users2 className="h-6 w-6" />
            <CardTitle>Patients Directory</CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button className="bg-green-500 text-white">
              Add New Patient
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Basic Info</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Medical Info</TableHead>
                <TableHead>Emergency Contact</TableHead>
                <TableHead>Guardian Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.patient_id}>
                  <TableCell>{patient.patient_id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{`${patient.first_name} ${patient.last_name}`}</p>
                      <p className="text-sm text-gray-500">
                        {calculateAge(patient.date_of_birth)} years ({patient.gender})
                      </p>
                      <Badge variant="outline">{patient.blood_type}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{patient.contact_number}</p>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                      <p className="text-xs text-gray-500">{patient.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {patient.has_allergy && (
                        <Badge variant="destructive" className="mr-1">
                          Allergies
                        </Badge>
                      )}
                      {patient.has_disease && (
                        <Badge variant="outline">
                          Has Disease
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{patient.emergency_contact_name}</p>
                      <p className="text-sm text-gray-500">{patient.emergency_contact_number}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.is_child ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{patient.parent_guardian_name}</p>
                        <p className="text-sm text-gray-500">{patient.parent_guardian_contact}</p>
                        <p className="text-xs text-gray-500">{patient.parent_guardian_email}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {patient.is_child && <Badge>Minor</Badge>}
                      <p className="text-xs text-gray-500">
                        Registered: {new Date(patient.registration_date).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Patient
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDetailsTable;
