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
    notes: string;
    mobile_number: string;
    name: string;
    age: string;
    gender: string;
    place: string;
}

interface Patient {
    outpatient_id: number;
    name: string;
    number: string; // Changed from mobile_number to number to match API
    place: string;
    gender: string;
    age: number;
}

const mockPatients: Patient[] = [
    { outpatient_id: 1, number: "1234567890", name: "John Doe", age: 25, gender: "male", place: "New York" },
    { outpatient_id: 2, number: "1234567890", name: "Jane Smith", age: 30, gender: "female", place: "Boston" },
    { outpatient_id: 3, number: "9876543210", name: "Alice Johnson", age: 45, gender: "female", place: "Chicago" },
    { outpatient_id: 4, number: "5555555555", name: "Bob Wilson", age: 35, gender: "male", place: "Miami" },
];


enum gender {
    'm' = "male",
    'f' = "female",
    'o' = "other"
};

const AddVisitPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        visit_date: new Date(),
        notes: '',
        mobile_number: '',
        name: '',
        age: '',
        gender: '',
        place: ''
    });
    
    const [suggestions, setSuggestions] = useState<Patient[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

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

    const handleMobileNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, mobile_number: value }));

        if (value.length >= 1) {
            try {
                const response = await fetch(`/api/patient?number=${value}`);
                const data = await response.json();
                console.log(data)
                setSuggestions(data.outpatients); // Access the outpatients array from response
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
        // Map the gender from single letter to full word using the enum
        const genderValue = patient.gender.toLowerCase() === 'm' ? 'male' :
                       patient.gender.toLowerCase() === 'f' ? 'female' : 'other';
    
        setFormData(prev => ({
            ...prev,
            mobile_number: patient.number,
            name: patient.name,
            age: patient.age.toString(),
            gender: genderValue,
            place: patient.place
        }));
        setShowSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mock Submission
        const payload = {
            ...formData,
            visit_date: format(formData.visit_date, "yyyy-MM-dd"),
        };

        console.log('Submitting visit with data:', payload);
        alert('Visit created successfully! Check the console for data.');

        // Reset form after successful submission
        setFormData({
            visit_date: new Date(),
            notes: '',
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
                            autoComplete="off"  // Add this line to disable browser autocomplete
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {suggestions.map((patient) => (
                                    <div
                                        key={patient.outpatient_id}
                                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                                        onClick={() => handleSelectPatient(patient)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium text-base text-gray-900">{patient.name}</div>
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    {patient.number}
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

                    {/* Common Fields (Priority, Status, Notes) */}
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
                                value={formData.gender}
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
                </form>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} className="w-full">Create Visit</Button>
            </CardFooter>
        </Card>
    );
};

export default AddVisitPage;