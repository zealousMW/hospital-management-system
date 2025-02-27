"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast"; // Update this import

const formSchema = z.object({
  visit_date: z.date(),
  notes: z.string().optional(),
  mobile_number: z
    .string()
    .min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Age is required"),
  gender: z.enum(["M", "F", "O"]),
  place: z.string().min(2, "Place must be at least 2 characters"),
  outpatient_id: z.number().optional(),
  department_type: z.string().optional(),
  department: z.string().optional(),
  cause: z.string().optional(),
});

type Patient = {
  outpatient_id: number;
  name: string;
  number: string;
  place: string;
  gender: string;
  age: number;
};

interface AddVisitPageProps {
  isScreening: boolean;
  onSuccess?: () => void; // Add this prop
}

const AddVisitPage: React.FC<AddVisitPageProps> = ({ isScreening, onSuccess }) => {
  const { toast } = useToast(); // Add this hook
  const [suggestions, setSuggestions] = useState<Patient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visit_date: new Date(),
      notes: "",
      mobile_number: "",
      name: "",
      age: "",
      gender: "M",
      place: "",
      department_type: "",
      department: "",
      cause: "",
    },
  });

  const handleSearchChange = async (value: string, field: string) => {
    if (value.length >= 1) {
      try {
        const response = await fetch(`/api/suggestion?number=${value}`);
        const data = await response.json();
        setSuggestions(data.outpatients);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    const fields = {
      mobile_number: patient.number,
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender.toUpperCase() as "M" | "F" | "O",
      place: patient.place,
      outpatient_id: patient.outpatient_id,
    };

    Object.entries(fields).forEach(([key, value]) => {
      form.setValue(key as keyof typeof fields, value);
    });

    setShowSuggestions(false);
  };

  const fetchDepartments = async (type: string) => {
    try {
      const response = await fetch(`/api/departmentApi?department_type=${type}`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/outpatientvisit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          visit_date: format(values.visit_date, "yyyy-MM-dd"),
          visit_time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          number: values.mobile_number,
          age: parseInt(values.age),
        }),
      });

      if (!response.ok) throw new Error("Failed to create visit");
      
      form.reset();
      toast({
        title: "Visit Created",
        description: "The outpatient visit was registered successfully.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create visit. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add this effect to handle department changes when screening mode changes
  useEffect(() => {
    if (isScreening) {
      form.setValue("department_type", "special");
      form.setValue("department", "OP Screening");
    }
  }, [isScreening, form]);

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {["name", "mobile_number", "age", "place"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {fieldName.replace("_", " ")} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString()
                            : typeof field.value === "boolean"
                            ? (field.value as string).toString()
                            : field.value
                        }
                        type={fieldName === "age" ? "number" : "text"}
                        onChange={(e) => {
                          field.onChange(e);
                          if (
                            fieldName === "mobile_number" ||
                            fieldName === "name"
                          ) {
                            handleSearchChange(e.target.value, fieldName);
                          }
                        }}
                        className="border rounded"
                      />
                    </FormControl>
                    <FormMessage />
                    {(fieldName === "mobile_number" || fieldName === "name") &&
                      showSuggestions && (
                        <div className="absolute z-10 w-full border bg-black text-white rounded shadow">
                          {suggestions.map((patient) => (
                            <div
                              key={patient.outpatient_id}
                              className="p-2 hover:opacity-75 cursor-pointer"
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
            ))}

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Male", "Female", "Other"].map((gender, i) => (
                        <SelectItem key={gender} value={["M", "F", "O"][i]}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Replace the cause FormField with this */}
            {!isScreening && (
              <FormField
                control={form.control}
                name="cause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Input {...field} className="border rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!isScreening && (
              <FormField
                control={form.control}
                name="department_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        fetchDepartments(value);
                        form.setValue("department", "");
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
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!isScreening && (
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem
                            key={dept.department_id}
                            value={dept.department_id.toString()}
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
            )}

            <Button type="submit" className="w-full">
              Register OutPatient
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddVisitPage;
