"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Droplet,
  Contact,
  Baby,
  Activity
} from 'lucide-react';

// Mock Data
const mockPatient = {
  patient_id: 1,
  first_name: "John",
  last_name: "Doe",
  date_of_birth: "1990-05-15",
  gender: "Male",
  contact_number: "+1 (555) 123-4567",
  email: "john.doe@email.com",
  address: "123 Medical Drive, Healthcare City, HC 12345",
  blood_type: "O+",
  emergency_contact_name: "Jane Doe",
  emergency_contact_number: "+1 (555) 987-6543",
  has_allergy: true,
  has_disease: false,
  is_child: false,
  registration_date: "2023-01-15T10:30:00",
  profile_photo: "https://example.com/patient-photo.jpg",
};

const mockChildPatient = {
  ...mockPatient,
  patient_id: 2,
  first_name: "Tommy",
  last_name: "Smith",
  date_of_birth: "2019-03-20",
  is_child: true,
  parent_guardian_name: "Sarah Smith",
  parent_guardian_contact: "+1 (555) 234-5678",
  parent_guardian_email: "sarah.smith@email.com",
  profile_photo: "https://example.com/child-photo.jpg",
};

const mockVisits = [
  {
    visit_id: 1,
    visit_date: "2024-01-15",
    visit_type: "Outpatient",
    primary_doctor_id: "Dr. Smith",
    current_status: "Active",
    notes: "Regular checkup, vital signs normal",
  },
  {
    visit_id: 2,
    visit_date: "2024-01-02",
    visit_type: "Inpatient",
    primary_doctor_id: "Dr. Johnson",
    current_status: "Discharged",
    notes: "Admitted for observation, discharged after 2 days",
  },
  {
    visit_id: 3,
    visit_date: "2023-12-15",
    visit_type: "Outpatient",
    primary_doctor_id: "Dr. Williams",
    current_status: "Critical",
    notes: "Emergency room visit due to high fever",
  },
  {
    visit_id: 4,
    visit_date: "2023-11-30",
    visit_type: "Outpatient",
    primary_doctor_id: "Dr. Smith",
    current_status: "Under Observation",
    notes: "Follow-up visit for previous treatment",
  },
];

interface Patient {
  patient_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string;
  address: string;
  blood_type: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  has_allergy: boolean;
  has_disease: boolean;
  is_child: boolean;
  registration_date: string;
  profile_photo: string;
  parent_guardian_name?: string;
  parent_guardian_contact?: string;
  parent_guardian_email?: string;
}

interface Visit {
  visit_id: number;
  visit_date: string;
  visit_type: string;
  primary_doctor_id: string;
  current_status: string;
  notes: string;
}

interface PatientInformationProps {
  patient: Patient;
  visits: Visit[];
}

const calculateAge = (dateOfBirth: string) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const PatientInformation: React.FC<PatientInformationProps> = ({ patient, visits }) => {
  const age = calculateAge(patient.date_of_birth);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={patient.profile_photo} alt={`${patient.first_name} ${patient.last_name}`} />
              <AvatarFallback>{patient.first_name[0]}{patient.last_name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Name:</span> 
                {patient.first_name} {patient.last_name}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Age:</span> 
                {age} years
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Contact:</span> 
                {patient.contact_number}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Email:</span> 
                {patient.email}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">Address:</span> 
              {patient.address}
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">Blood Type:</span> 
              <Badge variant="secondary">{patient.blood_type}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Contact className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">Emergency Contact:</span> 
              {patient.emergency_contact_name} ({patient.emergency_contact_number})
            </div>
          </div>

          {patient.is_child && (
            <div className="md:col-span-2 space-y-2 border-t pt-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <Baby className="h-4 w-4" />
                Guardian Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><span className="font-semibold">Name:</span> {patient.parent_guardian_name}</div>
                <div><span className="font-semibold">Contact:</span> {patient.parent_guardian_contact}</div>
                <div><span className="font-semibold">Email:</span> {patient.parent_guardian_email}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Visit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit Date</TableHead>
                <TableHead>Visit Type</TableHead>
                <TableHead>Primary Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit: Visit) => (
                <TableRow key={visit.visit_id}>
                  <TableCell>{visit.visit_date}</TableCell>
                  <TableCell>
                    <Badge variant={visit.visit_type === 'Inpatient' ? 'destructive' : 'default'}>
                      {visit.visit_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{visit.primary_doctor_id}</TableCell>
                  <TableCell>
                    <Badge variant={
                      visit.current_status === 'Critical' ? 'destructive' :
                      visit.current_status === 'Active' ? 'default' :
                      visit.current_status === 'Under Observation' ? 'outline' :
                      'secondary'
                    }>
                      {visit.current_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{visit.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const PatientInformationDemo = () => {
  const patient = calculateAge(mockPatient.date_of_birth) < 18 ? mockChildPatient : mockPatient;

  return (
    <div>
      <PatientInformation 
        patient={patient} 
        visits={mockVisits} 
      />
    </div>
  );
};

export { PatientInformation };
export default PatientInformationDemo;
