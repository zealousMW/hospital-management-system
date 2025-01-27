"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AddVisitPage from './addvisits';
import PatientRegistrationForm from '../patients/addpatient';
import { Search, Hospital, MoreHorizontal, Eye, UserPlus, FileText } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Visits from '@/app/patients/page';

const Visitstable = () => {
  const [inpatientVisits, setInpatientVisits] = useState<InpatientVisit[]>([]);
  const [outpatientVisits, setOutpatientVisits] = useState<OutpatientVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  interface Visit {
    visit_id: number;
    patient_name: string;
    primary_doctor: string;
    visit_date: string;
    status: string;
    department: string;
    gender: string;  // Add gender to base interface
  }

  interface InpatientVisit extends Visit {
    admission_date: string;
    expected_discharge_date: string;
    bed_id: number;
    current_status: string;
  }

  interface OutpatientVisit extends Visit {
    visit_type: string;
  }

  const isNewVisit = (visitDate: string): boolean => {
    const currentDate = new Date();
    const visitDateObj = new Date(visitDate);
    const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    return visitDateObj >= sevenDaysAgo;
  };

  const handleRegisterPatient = () => {
    // Logic to register a new patient
    console.log('Register Patient button clicked');
  };

  const handleAddVisit = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewPatient = (patientId: number) => {
    console.log('View patient:', patientId);
    // Add your view patient logic here
  };

  const handleConvertToInpatient = (patientId: number) => {
    console.log('Convert to inpatient:', patientId);
    // Add your conversion logic here
  };

  const handleViewDetails = (visitId: number) => {
    console.log('View visit details:', visitId);
    // Add your view details logic here
  };

  const filteredInpatientVisits = inpatientVisits.filter(visit =>
    visit.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOutpatientVisits = outpatientVisits.filter(visit =>
    visit.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simulated data fetch (replace with actual API call)
  useEffect(() => {
    // Mock data to demonstrate the structure
    const mockInpatientVisits = [
      {
        visit_id: 1,
        patient_name: 'John Doe',
        primary_doctor: 'Dr. Smith',
        visit_date: '2024-01-15',
        admission_date: '2024-01-15',
        expected_discharge_date: '2024-01-20',
        status: 'Active',
        bed_id: 101,
        department: 'Cardiology',
        current_status: 'Stable',
        gender: 'Male'  // Add gender
      },
      {
        visit_id: 2,
        patient_name: 'Jane Smith',
        primary_doctor: 'Dr. Johnson',
        visit_date: '2023-12-10',
        admission_date: '2023-12-10',
        expected_discharge_date: '2023-12-25',
        status: 'Critical',
        bed_id: 205,
        department: 'Intensive Care',
        current_status: 'Critical',
        gender: 'Female'  // Add gender
      }
    ];

    const mockOutpatientVisits = [
      {
        visit_id: 3,
        patient_name: 'Alice Brown',
        primary_doctor: 'Dr. Williams',
        visit_date: '2024-01-20',
        visit_type: 'Outpatient',
        status: 'Discharged',
        department: 'General Medicine',
        gender: 'Female'  // Add gender
      },
      {
        visit_id: 4,
        patient_name: 'Bob Miller',
        primary_doctor: 'Dr. Garcia',
        visit_date: '2023-12-18',
        visit_type: 'Outpatient',
        status: 'Under Observation',
        department: 'Neurology',
        gender: 'Male'  // Add gender
      }
    ];

    setInpatientVisits(mockInpatientVisits);
    setOutpatientVisits(mockOutpatientVisits);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading visits...</div>;
  }

  return (
    
      
    <>
    <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Hospital Visits </h1>
        <p className="text-sm text-gray-600">Track all visits here</p>
      </div>
      <div className='flex flex-1 flex-col gap-4  pt-0'>
      <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min" >
      <Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <Hospital className="h-4 w-4 " />
      <span>Hospital Visits List</span>
    </CardTitle>
    <CardDescription className="mb-8">Track all visits here</CardDescription>
    <div className="flex justify-between items-center mb-4 mt-4">
            <div className="relative w-1/3">
              <Input
                type="text"
                placeholder="Search by patient name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddVisit}>Add Visit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Visit</DialogTitle>
                    <DialogDescription>
                      {/* Form elements for adding a new visit */}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <AddVisitPage />
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleRegisterPatient}>Register Patient</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                    <DialogDescription>
                      {/* Form elements for registering a new patient */}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <PatientRegistrationForm />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
  </CardHeader>
  <CardContent className='overflow-x-auto'>
  <Tabs defaultValue="inpatient">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inpatient">Inpatient Visits</TabsTrigger>
              <TabsTrigger value="outpatient">Outpatient Visits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inpatient">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visit ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Primary Doctor</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Expected Discharge</TableHead>
                    <TableHead>Initial Status</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Bed ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Old / New</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInpatientVisits.map((visit) => (
                    <TableRow key={visit.visit_id}>
                      <TableCell>{visit.visit_id}</TableCell>
                      <TableCell>{visit.patient_name}</TableCell>
                      <TableCell>{visit.gender}</TableCell>
                      <TableCell>{visit.primary_doctor}</TableCell>
                      <TableCell>{visit.visit_date}</TableCell>
                      <TableCell>{visit.admission_date}</TableCell>
                      <TableCell>{visit.expected_discharge_date}</TableCell>
                      <TableCell>{visit.status}</TableCell>
                      <TableCell>{visit.current_status || 'TBD'}</TableCell>
                      <TableCell>{visit.bed_id}</TableCell>
                      <TableCell>{visit.department}</TableCell>
                      <TableCell>
                        <Badge variant={isNewVisit(visit.visit_date) ? 'default' : 'secondary'}>
                          {isNewVisit(visit.visit_date) ? 'New' : 'Old'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewPatient(visit.visit_id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDetails(visit.visit_id)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="outpatient">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visit ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Primary Doctor</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Old / New</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOutpatientVisits.map((visit) => (
                    <TableRow key={visit.visit_id}>
                      <TableCell>{visit.visit_id}</TableCell>
                      <TableCell>{visit.patient_name}</TableCell>
                      <TableCell>{visit.gender}</TableCell>
                      <TableCell>{visit.primary_doctor}</TableCell>
                      <TableCell>{visit.visit_date}</TableCell>
                      <TableCell>{visit.department}</TableCell>
                      <TableCell>
                        <Badge variant={isNewVisit(visit.visit_date) ? 'default' : 'secondary'}>
                          {isNewVisit(visit.visit_date) ? 'New' : 'Old'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewPatient(visit.visit_id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDetails(visit.visit_id)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleConvertToInpatient(visit.visit_id)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Convert to Inpatient
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>


  </CardContent>
  <CardFooter>
    <p>...</p>
  </CardFooter>
</Card>

      </div>

      </div>
      
    </>
  );
};

export default Visitstable;