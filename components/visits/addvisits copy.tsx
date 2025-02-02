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


interface FormData {
    visit_date: Date;
    admission_date: Date;
    expected_discharge_date: Date;
    actual_discharge_date: Date;
    status: string;
    notes: string;
    bed_id: string;
    ward: string;
    mobile_number: string;
    name: string;
    age: string;
    gender: string;
    place: string;
}

interface Patient {
    id: number;
    mobile_number: string;
    name: string;
    age: string;
    gender: string;
    place: string;
}

const mockPatients: Patient[] = [
    { id: 1, mobile_number: "1234567890", name: "John Doe", age: "25", gender: "male", place: "New York" },
    { id: 2, mobile_number: "1234567890", name: "Jane Smith", age: "30", gender: "female", place: "Boston" },
    { id: 3, mobile_number: "9876543210", name: "Alice Johnson", age: "45", gender: "female", place: "Chicago" },
    { id: 4, mobile_number: "5555555555", name: "Bob Wilson", age: "35", gender: "male", place: "Miami" },
];

const AddVisitPage: React.FC = () => {
    const [visitType, setVisitType] = useState<'Inpatient' | 'Outpatient'>('Outpatient');
    const [formData, setFormData] = useState<FormData>({
        visit_date: new Date(),
        admission_date: new Date(),
        expected_discharge_date: new Date(),
        actual_discharge_date: new Date(),
        status: 'Active',
        notes: '',
        bed_id: '',
        ward: '',
        mobile_number: '',
        name: '',
        age: '',
        gender: '',
        place: ''
    });
    
    const [beds, setBeds] = useState<Bed[]>([]);
    const [wards, setWards] = useState<string[]>(['Ward 1', 'Ward 2', 'Ward 3']);
    const [suggestions, setSuggestions] = useState<Patient[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Mock Data
    const mockBeds: Bed[] = [
        { bed_id: 101, bed_number: 'A1', room_id: 'Room 1' },
        { bed_id: 102, bed_number: 'A2', room_id: 'Room 1' },
        { bed_id: 103, bed_number: 'B1', room_id: 'Room 2' },
    ];

    useEffect(() => {
        // Load mock data instead of API calls
        setBeds(mockBeds);
    }, []);

    interface Bed {
        bed_id: number;
        bed_number: string;
        room_id: string;
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

    const handleMobileNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, mobile_number: value }));

        // Fetch suggestions from API based on mobile number
        if (value.length >= 1) {
            try {
                const response = await fetch(`/api/patient?mobile_number=${value}`);
                setSuggestions(response.outpatient);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching patient suggestions:', error);
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectPatient = (patient: Patient) => {
        setFormData(prev => ({
            ...prev,
            mobile_number: patient.mobile_number,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            place: patient.place
        }));
        setShowSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

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
            visit_date: new Date(),
            admission_date: new Date(),
            expected_discharge_date: new Date(),
            actual_discharge_date: new Date(),
            status: 'Active',
            notes: '',
            bed_id: '',
            ward: '',
            mobile_number: '',
            name: '',
            age: '',
            gender: '',
            place: ''
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Mobile Number Search - Moved to top */}
                    <div className="relative">
                        <Label>Mobile Number</Label>
                        <Input
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleMobileNumberChange}
                            placeholder="Enter mobile number"
                            className="w-full"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {suggestions.map((patient) => (
                                    <div
                                        key={patient.id}
                                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                                        onClick={() => handleSelectPatient(patient)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium text-base text-gray-900">{patient.name}</div>
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    {patient.mobile_number}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {patient.age} yrs | {patient.gender} | {patient.place}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Visit Type Toggle */}
                    <div className="flex items-center space-x-2">
                        <Label>Inpatient</Label>
                        <Switch
                            checked={visitType === 'Inpatient'}
                            onCheckedChange={(checked) => setVisitType(checked ? 'Inpatient' : 'Outpatient')}
                        />
                        <Label>Outpatient</Label>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter patient name"
                                    />
                                </div>
                                <div>
                                    <Label>Age</Label>
                                    <Input
                                        name="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        placeholder="Enter age"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Gender</Label>
                                    <Select
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Place</Label>
                                    <Input
                                        name="place"
                                        value={formData.place}
                                        onChange={handleInputChange}
                                        placeholder="Enter place"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Notes</Label>
                                <Input
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Enter notes"
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