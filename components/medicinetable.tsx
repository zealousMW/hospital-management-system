"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Pill, MoreHorizontal, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MedicineForm from './addmed';

interface Medicine {
    medicine_id:number,
    medicine_name:string,
    medicine_type:string,
    medicine_availability:string,
    medicine_expiry_date:string
  }

const MedicineTable = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState<keyof Medicine>('medicine_name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Add statistics calculation
    const getTotalMedicines = () => medicines.length;
    const getLowStockMedicines = () => medicines.filter(m => parseInt(m.medicine_availability) < 20).length;
    const getExpiringMedicines = () => {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return medicines.filter(m => new Date(m.medicine_expiry_date) <= thirtyDaysFromNow).length;
    };

    // Add sorting function
    const handleSort = (field: keyof Medicine) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Sort and filter medicines
    const sortedAndFilteredMedicines = medicines
        .filter(medicine =>
            medicine.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.medicine_type.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortDirection === 'asc') {
                return a[sortField] > b[sortField] ? 1 : -1;
            }
            return a[sortField] < b[sortField] ? 1 : -1;
        });

    // Pagination
    const totalPages = Math.ceil(sortedAndFilteredMedicines.length / itemsPerPage);
    const paginatedMedicines = sortedAndFilteredMedicines.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockMedicines: Medicine[] = [
            {
                medicine_id: 1,
                medicine_name:"AMUKKARA",
                medicine_type:"CHOORANAM",
                medicine_availability:"20",
                medicine_expiry_date:"20-03-2025"
            },
            {
                medicine_id: 2,
                medicine_name:"MUTHUCHIPPI",
                medicine_type:"PARPAM",
                medicine_availability:"45",
                medicine_expiry_date:"20-03-2025"
            },
            {
                medicine_id: 3,
                medicine_name:"ANNABEDHI",
                medicine_type:"CHENDHOORAM",
                medicine_availability:"10",
                medicine_expiry_date:"20-03-2025"
            },
        ];

        setMedicines(mockMedicines);
        setLoading(false);
    }, []);

    const handleMenuItem = (medicine_type:string) =>{
        if(medicine_type!=='all'){
            setSearchTerm(medicine_type);
        }
        else{
            setSearchTerm('');
        }
    }

    return (
        <div className="space-y-4">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Total Medicines</p>
                            <p className="text-2xl font-bold">{getTotalMedicines()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="">
                    <CardContent className="p-4 bg-yellow-400">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Low Stock</p>
                            <p className="text-2xl font-bold text-yellow-600">{getLowStockMedicines()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-red-400">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Expiring Soon</p>
                            <p className="text-2xl font-bold text-red-600">{getExpiringMedicines()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Pill className="h-6 w-6" />
                            <CardTitle>Medicines Directory</CardTitle>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search medicines..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 w-[300px]"
                                />
                            </div>
                            <div className='flex items-center space-x-4'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-35 p-0">
                                            Medicine Types
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={()=>handleMenuItem("all")}>
                                            All
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>handleMenuItem("chooranam")}>
                                            CHOORANAM
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>handleMenuItem("parpam")}>
                                            PARPAM
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>handleMenuItem("chendhooram")}>
                                            CHENDHOORAM
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>handleMenuItem("maathirai")}>
                                            MAATHIRAI
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>handleMenuItem("vadakkam")}>
                                            VADAKKAM
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>handleMenuItem("rasayanam")}>
                                            RASAYANAM
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>handleMenuItem("mezhugu")}>
                                            MEZHUGU
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Dialog>
              <DialogTrigger asChild>
                
                  <Button className="bg-green-500 text-white">
                                Add New Medicine
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
                  <MedicineForm />
                </div>
              </DialogContent>
            </Dialog>
                            
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead onClick={() => handleSort('medicine_id')} className="cursor-pointer">
                                        ID {sortField === 'medicine_id' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('medicine_name')} className="cursor-pointer">
                                        Medicine Name {sortField === 'medicine_name' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('medicine_type')} className="cursor-pointer">
                                        Medicine Type {sortField === 'medicine_type' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('medicine_availability')} className="cursor-pointer">
                                        Availability {sortField === 'medicine_availability' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('medicine_expiry_date')} className="cursor-pointer">
                                        Expiry Date {sortField === 'medicine_expiry_date' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(5).fill(0).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={6}><Skeleton className="h-12" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    paginatedMedicines.map((medicine) => (
                                        <TableRow key={medicine.medicine_id} className="hover:bg-gray-50">
                                            <TableCell>{medicine.medicine_id}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-medium">{medicine.medicine_name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{medicine.medicine_type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={parseInt(medicine.medicine_availability) < 20 ? "destructive" : "default"}
                                                >
                                                    {medicine.medicine_availability}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-500">{medicine.medicine_expiry_date}</span>
                                                    {new Date(medicine.medicine_expiry_date) <= new Date() && (
                                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                                    )}
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
                                                            Edit Medicine
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Medicine
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default MedicineTable;