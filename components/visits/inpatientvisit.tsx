"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AddVisitPage from './addop';
import { Hospital, Plus } from 'lucide-react';
import AddInpatientForm from './addip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InpatientVisit {
  inpatient_id: number;
  outpatient_id: number;
  ward_id: string;
  bed_id: string;
  admission_date: string;
  admission_time: string;
  attender_name: string;
  attender_relationship: string;
  attender_contact_number: string;
  attender_ward_id?: string;
  attender_bed_id?: string;
  outpatient: {
    name: string;
    age: number;
    gender: string;
  };
}

const Inpatientvisits = () => {
  const [inpatientVisits, setInpatientVisits] = useState<InpatientVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVisitsData = async () => {
    try {
      const response = await fetch('/api/inpatientvisit');
      if (!response.ok) throw new Error('Failed to fetch inpatient visits');
      const data = await response.json();
      setInpatientVisits(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitsData();
  }, []);

  const filteredVisits = inpatientVisits.filter(visit =>
    Object.values(visit).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    visit.outpatient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="text-center mb-4">
        <Hospital className="h-8 w-8 mx-auto mb-2 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-700">Hospital Visits</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4 flex-col sm:flex-row justify-between">
            <Input
              type="text"
              placeholder="Search visits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New InPatient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Add New InPatient</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[80vh] w-full pr-4">
                  <AddInpatientForm />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Ward & Bed</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Attender Name</TableHead>
                  <TableHead>Attender Contact</TableHead>
                  <TableHead>Attender Ward</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => (
                    <TableRow key={visit.inpatient_id}>
                      <TableCell>{visit.outpatient.name}</TableCell>
                      <TableCell>{visit.outpatient.age}</TableCell>
                      <TableCell>{visit.outpatient.gender}</TableCell>
                      <TableCell>
                        Ward: {visit.ward_id}
                        <br />
                        <span className="text-xs text-gray-500">
                          Bed: {visit.bed_id}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(visit.admission_date).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-500">
                          {visit.admission_time}
                        </span>
                      </TableCell>
                      <TableCell>
                        {visit.attender_name}
                        <br />
                        <span className="text-xs text-gray-500">
                          {visit.attender_relationship}
                        </span>
                      </TableCell>
                      <TableCell>{visit.attender_contact_number}</TableCell>
                      <TableCell>
                        {visit.attender_ward_id && (
                          <>
                            Ward: {visit.attender_ward_id}
                            <br />
                            Bed: {visit.attender_bed_id}
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => console.log('View details:', visit.inpatient_id)}
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No Inpatients found
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

export default Inpatientvisits;