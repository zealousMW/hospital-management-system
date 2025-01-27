import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

const MedicineForm = () => {
  const [formData, setFormData] = useState({
    medicine_name: '',
    medicine_type: '',
    medicine_availability: '',
    medicine_expiry_date: ''
  });

  const [errors, setErrors] = useState({
    medicine_name: '',
    medicine_type: '',
    medicine_availability: '',
    medicine_expiry_date: ''
  });

  const medicineTypes = [
    'CHOORANAM',
    'PARPAM',
    'CHENDHOORAM',
    'MAATHIRAI',
    'VADAKKAM',
    'RASAYANAM',
    'MEZHUGU'
  ];

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      medicine_name: '',
      medicine_type: '',
      medicine_availability: '',
      medicine_expiry_date: ''
    };

    if (!formData.medicine_name.trim()) {
      newErrors.medicine_name = 'Medicine name is required';
      isValid = false;
    }

    if (!formData.medicine_type) {
      newErrors.medicine_type = 'Medicine type is required';
      isValid = false;
    }

    if (!formData.medicine_availability) {
      newErrors.medicine_availability = 'Availability is required';
      isValid = false;
    } else if (isNaN(Number(formData.medicine_availability)) || Number(formData.medicine_availability) < 0) {
      newErrors.medicine_availability = 'Please enter a valid number';
      isValid = false;
    }

    if (!formData.medicine_expiry_date) {
      newErrors.medicine_expiry_date = 'Expiry date is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Add New Medicine</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medicine_name">Medicine Name</Label>
            <Input
              id="medicine_name"
              value={formData.medicine_name}
              onChange={(e) => handleChange('medicine_name', e.target.value)}
              className={errors.medicine_name ? 'border-red-500' : ''}
            />
            {errors.medicine_name && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.medicine_name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicine_type">Medicine Type</Label>
            <Select
              value={formData.medicine_type}
              onValueChange={(value) => handleChange('medicine_type', value)}
            >
              <SelectTrigger className={errors.medicine_type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select medicine type" />
              </SelectTrigger>
              <SelectContent>
                {medicineTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.medicine_type && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.medicine_type}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicine_availability">Availability</Label>
            <Input
              id="medicine_availability"
              type="number"
              value={formData.medicine_availability}
              onChange={(e) => handleChange('medicine_availability', e.target.value)}
              className={errors.medicine_availability ? 'border-red-500' : ''}
            />
            {errors.medicine_availability && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.medicine_availability}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicine_expiry_date">Expiry Date</Label>
            <Input
              id="medicine_expiry_date"
              type="date"
              value={formData.medicine_expiry_date}
              onChange={(e) => handleChange('medicine_expiry_date', e.target.value)}
              className={errors.medicine_expiry_date ? 'border-red-500' : ''}
            />
            {errors.medicine_expiry_date && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.medicine_expiry_date}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">
            Add Medicine
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MedicineForm;