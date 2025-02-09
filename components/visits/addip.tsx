import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DepartmentType = 'UG' | 'PG' | 'SPECIAL';

interface Department {
  department_id: number;
  department_name: string;
  department_type: DepartmentType;
  description: string;
}

interface Ward {
  ward_id: number;
  ward_name: string;
  ward_type: string;
  gender: string;
  number_of_beds: number;
}

interface Bed {
  bed_id: number;
  bed_number: string;
  is_occupied: boolean;
}

type Patient = {
  outpatient_id: number;
  name: string;
  number: string;
  place: string;
  gender: string;
  age: number;
};

const formSchema = z.object({
  outpatient_id: z.number().optional(), // Add this field
  phone_number: z.string().min(10, "Phone number must be 10 digits").max(10),
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(1, "Address is required"),
  aadhaar_no: z.string().min(12, "Aadhaar number must be 12 digits").max(12),
  department_type: z.string().min(1, "Department type is required"),
  department: z.string().min(1, "Department is required"),
  ward_no: z.string().min(1, "Ward is required"),
  bed_no: z.string().min(1, "Bed number is required"),
  attender_name: z.string().min(1, "Attender name is required"),
  attender_gender: z.string().min(1, "Attender gender is required"),
  attender_phone: z.string().min(10, "Attender phone must be 10 digits").max(10),
  relationship: z.string().min(1, "Relationship is required"),
  attender_ward_no: z.string().optional(),
  attender_bed_no: z.string().optional(),
})

const AddInpatientForm = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<DepartmentType>('UG');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const [attenderSelectedWardId, setAttenderSelectedWardId] = useState<number | null>(null);
  const [attenderBeds, setAttenderBeds] = useState<Bed[]>([]);
  const [suggestions, setSuggestions] = useState<Patient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchDepartments = async (type: DepartmentType) => {
    try {
      const response = await fetch(`/api/departmentApi?department_type=${type}`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  const fetchWards = async (departmentId: number) => {
    try {
      const response = await fetch(`/api/wards?department_id=${departmentId}`);
      const data = await response.json();
      setWards(data);
    } catch (error) {
      console.error('Error fetching wards:', error);
      setWards([]);
    }
  };

  const fetchBeds = async (wardId: number) => {
    try {
      const response = await fetch(`/api/beds?ward_id=${wardId}`);
      const data = await response.json();
      return data.filter((bed: Bed) => !bed.is_occupied);
    } catch (error) {
      console.error('Error fetching beds:', error);
      return [];
    }
  };

  const handleMobileNumberChange = async (value: string) => {
    if (value.length >= 1) {
      try {
        const response = await fetch(`/api/suggestion?number=${value}`);
        const data = await response.json();
        setSuggestions(data.outpatients);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    form.setValue('outpatient_id', patient.outpatient_id); // Add this line
    form.setValue('phone_number', patient.number);
    form.setValue('name', patient.name);
    form.setValue('age', patient.age.toString());
    form.setValue('gender', patient.gender.toLowerCase());
    form.setValue('address', patient.place);
    setShowSuggestions(false);
  };

  useEffect(() => {
    fetchDepartments(selectedType);
  }, [selectedType]);

  useEffect(() => {
    if (selectedDepartmentId) {
      fetchWards(selectedDepartmentId);
    }
  }, [selectedDepartmentId]);

  useEffect(() => {
    if (selectedWardId) {
      fetchBeds(selectedWardId).then(setBeds);
    } else {
      setBeds([]);
    }
  }, [selectedWardId]);

  useEffect(() => {
    if (attenderSelectedWardId) {
      fetchBeds(attenderSelectedWardId).then(setAttenderBeds);
    } else {
      setAttenderBeds([]);
    }
  }, [attenderSelectedWardId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: "",
      name: "",
      age: "",
      gender: "",
      address: "",
      aadhaar_no: "",
      department: "",
      ward_no: "",
      bed_no: "",
      attender_name: "",
      attender_gender: "",
      attender_phone: "",
      relationship: "",
      attender_ward_no: "",
      attender_bed_no: "",
      outpatient_id: undefined, // Add this field
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const currentDate = new Date();
      
      const payload = {
        outpatient_id: values.outpatient_id, // Add this line
        name: values.name,
        number: values.phone_number,
        age: parseInt(values.age),
        address: values.address,
        ward_id: parseInt(values.ward_no),
        bed_id: parseInt(values.bed_no),
        aadhaar_number: values.aadhaar_no,
        admission_date: currentDate.toISOString().split('T')[0],
        admission_time: currentDate.toTimeString().split(' ')[0],
        attender_name: values.attender_name,
        attender_relationship: values.relationship,
        attender_contact_number: values.attender_phone,
        attender_address: values.address, // Using same address as patient
        attender_ward_id: values.attender_ward_no ? parseInt(values.attender_ward_no) : null,
        attender_bed_id: values.attender_bed_no ? parseInt(values.attender_bed_no) : null,
      };

      const response = await fetch('/api/inpatientvisit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create inpatient record');
      }

      const data = await response.json();
      console.log('Success:', data);
      
      // Reset form
      form.reset();
      
      // You might want to show a success message or redirect
      alert('Inpatient record created successfully');

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create inpatient record');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleMobileNumberChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-black text-white rounded-md shadow-lg">
                    {suggestions.map((patient) => (
                      <div
                        key={patient.outpatient_id}
                        className="p-2 hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleSelectPatient(patient)}
                      >
                        {patient.name} - {patient.number}
                      </div>
                    ))}
                  </div>
                )}
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aadhaar_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aadhaar Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="department_type"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Department Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    setSelectedType(value as DepartmentType);
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="UG">UG</SelectItem>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="SPECIAL">Special</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Department</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    const dept = departments.find(d => d.department_name === value);
                    setSelectedDepartmentId(dept?.department_id ?? null);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(departments || []).map((dept) => (
                      <SelectItem 
                        key={dept.department_id} 
                        value={dept.department_name}
                      >
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ward_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ward</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedWardId(parseInt(value));
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(wards || []).map((ward) => (
                    <SelectItem 
                      key={ward.ward_id} 
                      value={ward.ward_id.toString()}
                    >
                      {ward.ward_name} ({ward.ward_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bed_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bed Number</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={!selectedWardId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(beds || []).map((bed) => (
                    <SelectItem 
                      key={bed.bed_id} 
                      value={bed.bed_id.toString()}
                    >
                      {bed.bed_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attender_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attender Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attender_gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attender Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select attender gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attender_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attender Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="attender_ward_no"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Attender Ward (Optional)</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setAttenderSelectedWardId(value ? parseInt(value) : null);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem 
                        key={ward.ward_id} 
                        value={ward.ward_id.toString()}
                      >
                        {ward.ward_name} ({ward.ward_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attender_bed_no"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Attender Bed (Optional)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!attenderSelectedWardId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bed" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(attenderBeds || []).map((bed) => (
                      <SelectItem 
                        key={bed.bed_id} 
                        value={bed.bed_id.toString()}
                      >
                        {bed.bed_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  )
}

export default AddInpatientForm
