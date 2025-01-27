import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const AddVisitPage: React.FC = () => {
    const [visitType, setVisitType] = useState<'Inpatient' | 'Outpatient'>('Outpatient');
    const [formData, setFormData] = useState<FormData>({
        patient_id: '',
        primary_doctor_id: '',
        visit_date: new Date(),
        admission_date: new Date(),
        expected_discharge_date: new Date(),
        actual_discharge_date: new Date(),
        status: 'Active',
        notes: '',
        bed_id: '',
        ward: ''
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [beds, setBeds] = useState<Bed[]>([]);
    const [wards, setWards] = useState<string[]>(['Ward 1', 'Ward 2', 'Ward 3']);

    // Mock Data
    const mockDoctors: Doctor[] = [
        { doctor_id: 1, first_name: 'John', last_name: 'Doe' },
        { doctor_id: 2, first_name: 'Jane', last_name: 'Smith' },
        { doctor_id: 3, first_name: 'Robert', last_name: 'Jones' },
    ];

    const mockBeds: Bed[] = [
        { bed_id: 101, bed_number: 'A1', room_id: 'Room 1' },
        { bed_id: 102, bed_number: 'A2', room_id: 'Room 1' },
        { bed_id: 103, bed_number: 'B1', room_id: 'Room 2' },
    ];

    const mockPatients: Patient[] = [
        { patient_id: 1, first_name: 'Alice', last_name: 'Brown', contact_number: '123-456-7890' },
        { patient_id: 2, first_name: 'Bob', last_name: 'Charlie', contact_number: '123-456-7890' },
        { patient_id: 3, first_name: 'David', last_name: 'Garcia', contact_number: '987-654-3210' },
    ];

    useEffect(() => {
        // Load mock data instead of API calls
        setDoctors(mockDoctors);
        setBeds(mockBeds);
    }, []);

    interface FormData {
        patient_id: string;
        primary_doctor_id: string;
        visit_date: Date;
        admission_date: Date;
        expected_discharge_date: Date;
        actual_discharge_date: Date;
        status: string;
        notes: string;
        bed_id: string;
        ward: string;
    }

    interface Doctor {
        doctor_id: number;
        first_name: string;
        last_name: string;
    }

    interface Bed {
        bed_id: number;
        bed_number: string;
        room_id: string;
    }

    interface Patient {
        patient_id: number;
        first_name: string;
        last_name: string;
        contact_number: string;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: FormData) => ({
            ...prev,
            [name]: value
        }));
    };

    interface HandleDateChange {
        (name: keyof FormData, date: Date): void;
    }

    const handleDateChange: HandleDateChange = (name, date) => {
        setFormData(prev => ({
            ...prev,
            [name]: date
        }));
    };

    const handleVisitTypeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVisitType(e.target.checked ? 'Inpatient' : 'Outpatient');
        // Reset admission and discharge dates when toggling the button
        setFormData(prev => ({
            ...prev,
            admission_date: new Date(),
            expected_discharge_date: new Date(),
            actual_discharge_date: new Date(),
            bed_id: ''
        }));
    };

    const handleSearchByPhoneNumber = () => {
        const filteredPatients = mockPatients.filter(
            patient => patient.contact_number === phoneNumber
        );
        setPatients(filteredPatients);
        if (filteredPatients.length === 1) {
            setFormData(prev => ({ ...prev, patient_id: filteredPatients[0].patient_id.toString() }));
        } else {
            setFormData(prev => ({ ...prev, patient_id: '' }));
        }
    };

    const handlePatientSelect = (patientId: number) => {
        setFormData(prev => ({ ...prev, patient_id: patientId.toString() }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.patient_id) {
            alert('Please search for a patient by phone number and select one.');
            return;
        }
        if (!formData.primary_doctor_id) {
            alert('Please select a primary doctor.');
            return;
        }

        if (visitType === 'Inpatient' && !formData.bed_id) {
            alert('Please select a bed for inpatient visits.');
            return;
        }

        // Mock Submission
        const payload = {
            ...formData,
            visit_type: visitType,
            visit_date: format(formData.visit_date, "yyyy-MM-dd"),
            admission_date: visitType === 'Inpatient' ? format(formData.admission_date, "yyyy-MM-dd") : null,
            expected_discharge_date: visitType === 'Inpatient' ? format(formData.expected_discharge_date, "yyyy-MM-dd") : null,
            actual_discharge_date: visitType === 'Inpatient' ? format(formData.actual_discharge_date, "yyyy-MM-dd") : null,
        };

        console.log('Submitting visit with data:', payload);
        alert('Visit created successfully! Check the console for data.');

        // Reset form after successful submission
        setFormData({
            patient_id: '',
            primary_doctor_id: '',
            visit_date: new Date(),
            admission_date: new Date(),
            expected_discharge_date: new Date(),
            actual_discharge_date: new Date(),
            status: 'Active',
            notes: '',
            bed_id: '',
            ward: ''
        });
        setPhoneNumber('');
        setPatients([]);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add Visit</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Visit Type Toggle */}
                    <div className="flex items-center space-x-2">
                        <Label>Inpatient</Label>
                        <Switch
                            checked={visitType === 'Inpatient'}
                            onCheckedChange={(checked) => setVisitType(checked ? 'Inpatient' : 'Outpatient')}
                        />
                        <Label>Outpatient</Label>
                    </div>

                    {/* Patient Search by Phone Number */}
                    <div>
                        <Label>Patient Phone Number</Label>
                        <div className="flex space-x-2">
                            <Input
                                type="tel"
                                placeholder="Enter phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <Button type="button" onClick={handleSearchByPhoneNumber}>Search</Button>
                        </div>
                        {patients.length > 0 && (
                            <div>
                                <Label>Select Patient:</Label>
                                <ul>
                                    {patients.map(patient => (
                                        <li key={patient.patient_id}>
                                            <Button
                                                variant={formData.patient_id === patient.patient_id.toString() ? "secondary" : "outline"}
                                                onClick={() => handlePatientSelect(patient.patient_id)}
                                            >
                                                {patient.first_name} {patient.last_name}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Primary Doctor */}
                    <div>
                        <Label>Primary Doctor</Label>
                        <Select
                            onValueChange={(value) => setFormData(prev => ({ ...prev, primary_doctor_id: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map(doctor => (
                                    <SelectItem key={doctor.doctor_id} value={doctor.doctor_id.toString()}>
                                        {doctor.first_name} {doctor.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Visit Date */}
                    <div>
                        <Label>Visit Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !formData.visit_date && "text-muted-foreground"
                                    )}
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {formData.visit_date ? (
                                        format(formData.visit_date, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                    mode="single"
                                    selected={formData.visit_date}
                                    onSelect={(date) => handleDateChange('visit_date', date as Date)}
                                    disabled={(date) =>
                                        date > new Date()
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/*Inpatient Specific Fields*/}
                    {visitType === 'Inpatient' && (
                        <>
                            <div>
                                <Label>Admission Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !formData.admission_date && "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {formData.admission_date ? (
                                                format(formData.admission_date, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.admission_date}
                                            onSelect={(date) => handleDateChange('admission_date', date as Date)}
                                            disabled={(date) =>
                                                date > new Date()
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <Label>Expected Discharge Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !formData.expected_discharge_date && "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {formData.expected_discharge_date ? (
                                                format(formData.expected_discharge_date, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.expected_discharge_date}
                                            onSelect={(date) => handleDateChange('expected_discharge_date', date as Date)}
                                            disabled={(date) =>
                                                date < formData.admission_date
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <Label>Actual Discharge Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !formData.actual_discharge_date && "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {formData.actual_discharge_date ? (
                                                format(formData.actual_discharge_date, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.actual_discharge_date}
                                            onSelect={(date) => handleDateChange('actual_discharge_date', date as Date)}
                                            disabled={(date) =>
                                                date < formData.admission_date
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <Label>Bed</Label>
                                <Select
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, bed_id: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Bed" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {beds.map(bed => (
                                            <SelectItem key={bed.bed_id} value={bed.bed_id.toString()}>
                                                {bed.bed_number} (Room: {bed.room_id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Ward</Label>
                                <Select
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, ward: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Ward" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wards.map(ward => (
                                            <SelectItem key={ward} value={ward}>
                                                {ward}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Status</Label>
                                <Select
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                        <SelectItem value="Under Observation">Under Observation</SelectItem>
                                        <SelectItem value="Discharged">Discharged</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {/* Common Fields (Priority, Status, Notes) */}
                    {visitType === 'Outpatient' && (
                        <>
                            <div>
                                <Label>Notes</Label>
                                <Input
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </>
                    )}

                </form>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} className="w-full">Create Visit</Button>
            </CardFooter>
        </Card>
    );
};

export default AddVisitPage;