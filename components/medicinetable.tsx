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

interface Medicine {
    medicine_id:number,
    medicine_name:string,
    medicine_type:string,
    medicine_availability:string,
    medicine_expiry_date:string
  }

const MedicineTable = () =>{
    const [medicines, setMedicines] = useState<Medicine[]>([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [loading, setLoading] = useState(true);

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

        const filteredMedicines = medicines.filter(medicine => 
            medicine.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.medicine_type.toLowerCase().includes(searchTerm)
          );
          const handleMenuItem = (medicine_type:string) =>{
            if(medicine_type!=='all'){
                setSearchTerm(medicine_type);
            }
            else{
                setSearchTerm('');
            }
          }
    return (
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
              <Button className="bg-green-500 text-white">
                Add New Medicine
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
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Medicine Type</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Expiry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.medicine_id}>
                    <TableCell>{medicine.medicine_id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{medicine.medicine_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{medicine.medicine_type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {medicine.medicine_availability}
                      </div>
                    </TableCell>
                   
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          {medicine.medicine_expiry_date}
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
}

export default MedicineTable;