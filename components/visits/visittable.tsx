"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AddVisitPage from './addvisits';
import { Search, Hospital, MoreHorizontal, Eye, UserPlus, FileText, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OutpatientVisit {
  visit_id: number;
  name: string;
  age: number;
  gender: string;
  date_of_visit: string;
  department: string;
  status: 'active' | 'completed' | 'cancelled';
}

const fetchOutpatientVisitsApi = async (): Promise<OutpatientVisit[]> => {
  try {
    const response = await fetch('/api/visits');
    if (!response.ok) throw new Error('Failed to fetch outpatient visits');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching outpatient visits:', error);
    return [];
  }
};

const Visitstable = () => {
  const [outpatientVisits, setOutpatientVisits] = useState<OutpatientVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof OutpatientVisit>('date_of_visit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const isNewVisit = (visitDate: string): boolean => {
    const currentDate = new Date();
    const visitDateObj = new Date(visitDate);
    return visitDateObj >= currentDate;
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
  };

  const handleConvertToInpatient = async (outpatientId: number) => {
    try {
      const response = await fetch(`/api/visits/${outpatientId}/convert`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Conversion failed');
      fetchVisitsData();
    } catch (err) {
      console.error('Failed to convert patient:', err);
      setError('Failed to convert patient to inpatient');
    }
  };

  const handleViewDetails = (outpatientId: number) => {
    console.log('View visit details:', outpatientId);
  };

  const filteredOutpatientVisits = outpatientVisits.filter(visit =>
    Object.values(visit).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const fetchVisitsData = async () => {
    try {
      setLoading(true);
      const outpatientData = await fetchOutpatientVisitsApi();
      setOutpatientVisits(outpatientData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching visits data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitsData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="text-center mb-4">
        <Hospital className="h-8 w-8 mx-auto mb-2 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-700 mb-1">Hospital Visits</h1>
        <p className="text-gray-500">Comprehensive visit management system</p>
      </div>

      <Card className="shadow-md">
        <CardHeader >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search in all fields..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Visit
                  </Button>
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
            </div>
          </div>
        </CardHeader>
        <CardContent className='overflow-x-auto'>
          <Tabs defaultValue="outpatient">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="outpatient">Outpatient Visits</TabsTrigger>
              <TabsTrigger value="inpatient">Inpatient Visits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="outpatient">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visit ID</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Visit Date</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Old / New</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOutpatientVisits.map((visit) => (
                      <TableRow key={visit.visit_id} className="hover:bg-blue-100 transition-colors">
                        <TableCell>{visit.visit_id}</TableCell>
                        <TableCell>{visit.name}</TableCell>
                        <TableCell>{visit.gender}</TableCell>
                        <TableCell>{visit.age}</TableCell>
                        <TableCell>{visit.date_of_visit}</TableCell>
                        <TableCell>{visit.department}</TableCell>
                        <TableCell>
                          <Badge variant={isNewVisit(visit.date_of_visit) ? 'default' : 'secondary'}>
                            {isNewVisit(visit.date_of_visit) ? 'New' : 'Old'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Actions menu</p>
                                  </TooltipContent>
                                </Tooltip>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewPatient(visit.visit_id)}>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center">
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Patient
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>View patient details</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewDetails(visit.visit_id)}>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center">
                                          <FileText className="mr-2 h-4 w-4" />
                                          View Details
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>View visit details</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleConvertToInpatient(visit.visit_id)}>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center">
                                          <UserPlus className="mr-2 h-4 w-4" />
                                          Convert to Inpatient
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Convert to inpatient</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="inpatient">
              <div className="text-center py-8">
                <p className="text-lg font-semibold">Inpatient table is in progress...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t">
          <div className="flex justify-between items-center w-full">
            <p className="text-sm text-gray-500">
              Showing {filteredOutpatientVisits.length} visits
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Visitstable;