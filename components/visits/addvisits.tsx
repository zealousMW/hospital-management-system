"use client";

import React, { useState } from "react";
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

const formSchema = z.object({
  visit_date: z.date(),
  notes: z.string().optional(),
  mobile_number: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Age is required"),
  gender: z.enum(["M", "F", "O"]),
  place: z.string().min(2, "Place must be at least 2 characters"),
  outpatient_id: z.number().optional(),
});

type Patient = {
  outpatient_id: number;
  name: string;
  number: string;
  place: string;
  gender: string;
  age: number;
};

const AddVisitPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Patient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    },
  });

  const handleMobileNumberChange = async (value: string) => {
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
      alert("Visit created successfully");
    } catch (error) {
      alert("Error creating visit");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {["mobile_number", "name", "age", "place"].map((fieldName) => (
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
                            : field.value
                        }
                        type={fieldName === "age" ? "number" : "text"}
                        onChange={(e) => {
                          field.onChange(e);
                          if (fieldName === "mobile_number") {
                            handleMobileNumberChange(e.target.value);
                          }
                        }}
                        className="border rounded"
                      />
                    </FormControl>
                    <FormMessage />
                    {fieldName === "mobile_number" && showSuggestions && (
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

            <Button type="submit" className="w-full">
              Register Visit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddVisitPage;
