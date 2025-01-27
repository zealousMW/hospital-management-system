"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Users2, MoreHorizontal, Eye, Edit, Trash2, AlertTriangle, MapPin, Download, Filter, RefreshCcw, UserPlus } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PatientRegistrationForm from './addpatient';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface Patient {
  patient_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  contact_number: string;
  email: string;
  address: string;
  registration_date: string;
  blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Patient>('patient_id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'child' | 'adult'>('all');
  const [filterMedical, setFilterMedical] = useState<'all' | 'allergy' | 'disease'>('all');
  const [ageRange, setAgeRange] = useState<'all' | 'under18' | '18to30' | '31to50' | 'over50'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female' | 'Other'>('all');
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const getFilteredPatients = () => {
    let filtered = [...patients];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.contact_number.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(patient => 
        filterStatus === 'child' ? patient.is_child : !patient.is_child
      );
    }

    // Medical condition filter
    if (filterMedical !== 'all') {
      filtered = filtered.filter(patient => 
        filterMedical === 'allergy' ? patient.has_allergy : patient.has_disease
      );
    }

    // Age range filter
    if (ageRange !== 'all') {
      filtered = filtered.filter(patient => {
        const age = calculateAge(patient.date_of_birth);
        switch (ageRange) {
          case 'under18': return age < 18;
          case '18to30': return age >= 18 && age <= 30;
          case '31to50': return age > 30 && age <= 50;
          case 'over50': return age > 50;
          default: return true;
        }
      });
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(patient => patient.gender === genderFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === 'asc') {
        if (aValue === undefined || bValue === undefined) {
          return 0;
        }
        return aValue < bValue ? -1 : 1;
      }
      if (aValue === undefined || bValue === undefined) {
        return 0;
      }
      return aValue > bValue ? -1 : 1;
    });

    return filtered;
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredPatients = getFilteredPatients();
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

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

  const handleViewDetails = (patientId: number) => {
    window.location.href = `http://localhost:3000/info?patientId=${patientId}`;
  };

  const handleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (patientId: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      // Add your delete logic here
      console.log('Deleting patient:', patientId);
    }
  };

  const handleAddressClick = (address: string) => {
    setSelectedAddress(address);
    setShowAddressDialog(true);
  };

  // Add statistics calculation
  const getStatistics = () => {
    const total = patients.length;
    const children = patients.filter(p => p.is_child).length;
    const withAllergies = patients.filter(p => p.has_allergy).length;
    const withDiseases = patients.filter(p => p.has_disease).length;

    return { total, children, withAllergies, withDiseases };
  };

  const stats = getStatistics();

  // Add export function
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Age', 'Gender', 'Contact', 'Email'];
    const data = filteredPatients.map(p => [
      p.patient_id,
      `${p.first_name} ${p.last_name}`,
      calculateAge(p.date_of_birth),
      p.gender,
      p.contact_number,
      p.email
    ]);

    const csvContent = [headers, ...data]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    // Add your data refresh logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          {/* Add similar cards for Children, Allergies, and Diseases */}
        </div>

        <div className="flex items-center justify-between mt-6">
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refreshData}
                  disabled={isRefreshing}
                >
                  <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh data</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportToCSV}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export to CSV</TooltipContent>
            </Tooltip>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-500 text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
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

        <div className="flex items-center space-x-4 mt-4">
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="child">Children Only</SelectItem>
              <SelectItem value="adult">Adults Only</SelectItem>
            </SelectContent>
          </Select>
          {/* Add similar Select components for other filters */}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-10">
            <AlertTriangle className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedPatients.length === currentItems.length}
                        onCheckedChange={(checked) => {
                          setSelectedPatients(
                            checked ? currentItems.map(p => p.patient_id) : []
                          );
                        }}
                      />
                    </TableHead>
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
                  {currentItems.map((patient) => (
                    <TableRow 
                      key={patient.patient_id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedPatients.includes(patient.patient_id)}
                          onCheckedChange={(checked) => {
                            setSelectedPatients(
                              checked
                                ? [...selectedPatients, patient.patient_id]
                                : selectedPatients.filter(id => id !== patient.patient_id)
                            );
                          }}
                        />
                      </TableCell>
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
                          <button
                            onClick={() => handleAddressClick(patient.address)}
                            className="text-xs text-blue-500 flex items-center hover:text-blue-700"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            View Address
                          </button>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(patient.patient_id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(patient.patient_id)}>
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
            <div className="flex items-center justify-between space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Patient Address</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-2">
            <p className="text-sm">{selectedAddress}</p>
            <div className="flex justify-end">
              <Button onClick={() => setShowAddressDialog(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PatientDetailsTable;
