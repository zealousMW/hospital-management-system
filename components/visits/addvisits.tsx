import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Basic form data structure
interface FormData {
    visit_date: Date;
    visit_time: string;
    notes: string;
    mobile_number: string;
    name: string;
    age: string;
    gender: string;
    place: string;
    outpatient_id?: number;
}

// Patient data structure from API
interface Patient {
    outpatient_id: number;
    name: string;
    number: string;
    place: string;
    gender: string;
    age: number;
}

const AddVisitPage: React.FC = () => {
    // Initialize form with empty values
    const [formData, setFormData] = useState<FormData>({
        visit_date: new Date(),
        visit_time: '',
        notes: '',
        mobile_number: '',
        name: '',
        age: '',
        gender: '',
        place: '',
        outpatient_id: undefined
    });
    
    // State for patient search suggestions
    const [suggestions, setSuggestions] = useState<Patient[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Handle regular input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle date selection
    const handleDateChange = (name: keyof FormData, date: Date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    // Search patients when mobile number is entered
    const handleMobileNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, mobile_number: value }));

        if (value.length >= 1) {
            try {
                const response = await fetch(`/api/suggestion?number=${value}`);
                const data = await response.json();
                setSuggestions(data.outpatients);
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

    // Fill form with selected patient's data
    const handleSelectPatient = (patient: Patient) => {
        const genderValue = patient.gender.toLowerCase() === 'm' ? 'male' :
                          patient.gender.toLowerCase() === 'f' ? 'female' : 'other';
    
        setFormData(prev => ({
            ...prev,
            mobile_number: patient.number,
            name: patient.name,
            age: patient.age.toString(),
            gender: genderValue,
            place: patient.place,
            outpatient_id: patient.outpatient_id
        }));
        setShowSuggestions(false);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Get current time
        const currentTime = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });

        // Check required fields
        if (!formData.name || !formData.mobile_number || !formData.age || !formData.gender || !formData.place) {
            alert('Please fill in all required fields');
            return;
        }

        // Prepare data for API
        const payload = {
            outpatient_id: formData.outpatient_id,
            visit_date: format(formData.visit_date, "yyyy-MM-dd"),
            visit_time: currentTime,
            name: formData.name,
            number: formData.mobile_number,
            age: parseInt(formData.age),
            place: formData.place,
            gender: formData.gender
        };

        try {
            const response = await fetch('/api/outpatientvisit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create visit');
            }

            // Reset form after success
            setFormData({
                visit_date: new Date(),
                visit_time: '',
                notes: '',
                mobile_number: '',
                name: '',
                age: '',
                gender: '',
                place: '',
                outpatient_id: undefined
            });

            alert('Visit created successfully');
        } catch (error) {
            console.error('Error creating visit:', error);
            alert(error);
        }
    };

    // UI Component
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Mobile number search with suggestions */}
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

                    {/* Visit date picker */}
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

                    {/* Patient details form */}
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