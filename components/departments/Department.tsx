"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  EditIcon,
  PlusCircleIcon,
  Stethoscope,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Users, Activity, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Department {
  department_id: number;
  department_name: string;
  department_type: string;
  description: string;
}

const departmentTypes = [
  { id: 1, name: "UG" },
  { id: 2, name: "PG" },
  { id: 3, name: "special" },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const getDepartmentStyles = (type: string) => {
  switch (type) {
    case "UG":
      return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200";
    case "PG":
      return "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200";
    case "special":
      return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200";
  }
};

export default function Department() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    department_name: "",
    department_type: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const options = [
    { value: "UG", label: "Undergraduate" },
    { value: "PG", label: "Postgraduate" },
    { value: "special", label: "Special Program" },
  ];

  const searchParams = useSearchParams();
  const initialSelected = searchParams.get("department_type") || "UG";
  const [selected, setSelected] = useState(initialSelected);
  const router = useRouter();
  useEffect(() => {
    fetchDepartments();
  }, [selected]);

  const fetchDepartments = async () => {
    await fetch(`/api/departmentApi?department_type=${selected}`)
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/departmentApi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDepartment),
      });

      if (response.ok) {
        fetchDepartments();
        setIsDialogOpen(false);
        setNewDepartment({
          department_name: "",
          department_type: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleEdit = async (id: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("department_id", id.toString());
    router.push(`/checking?${params.toString()}`);
  };

  const stats = [
    {
      title: "Total Departments",
      value: departments.length,
      icon: Building2,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "UG Departments",
      value: departments.filter(d => d.department_type === "UG").length,
      icon: School,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Active Staff",
      value: "250+",
      icon: Users,
      gradient: "from-violet-500 to-violet-600",
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 space-y-4">
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-6 space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`rounded-lg p-3 bg-gradient-to-br ${stat.gradient}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Building2 className="mr-2 h-6 w-6 text-primary" />
                Hospital Departments
              </h2>
              <p className="text-muted-foreground">Manage and track departments</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  New Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      value={newDepartment.department_name}
                      onChange={(e) =>
                        setNewDepartment({
                          ...newDepartment,
                          department_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Department Type</Label>
                    <Select
                      value={newDepartment.department_type}
                      onValueChange={(value) =>
                        setNewDepartment({
                          ...newDepartment,
                          department_type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentTypes.map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newDepartment.description}
                      onChange={(e) =>
                        setNewDepartment({
                          ...newDepartment,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Add Department
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search departments..."
                className="w-full"
                onChange={(e) => {/* Add search functionality */}}
              />
            </div>
            <div className="flex items-center space-x-2 bg-secondary/10 p-3 rounded-md">
              <RadioGroup
                defaultValue={selected}
                onValueChange={setSelected}
                className="flex space-x-4"
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "cursor-pointer px-4 py-2 rounded-lg transition-all",
                      selected === option.value
                        ? "bg-primary text-white shadow-md"
                        : "hover:bg-muted"
                    )}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="hidden"
                    />
                    <Label htmlFor={option.value} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="rounded-lg border shadow-sm overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableHead>ID</TableHead>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.length > 0 ? (
                  departments.map((dept, index) => (
                    <motion.tr
                      key={dept.department_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300`}
                    >
                      <TableCell className="font-medium">#{dept.department_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-semibold text-lg shadow-sm`}>
                            {dept.department_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{dept.department_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {dept.department_type} Department
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`px-3 py-1 rounded-lg ${getDepartmentStyles(dept.department_type)}`}
                        >
                          {dept.department_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="truncate text-muted-foreground">
                          {dept.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(dept.department_id)}
                            className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-white border-none shadow-sm"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Show Patients
                          </Button>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center text-muted-foreground"
                      >
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-3">
                          <Building2 className="h-8 w-8 text-gray-500" />
                        </div>
                        <p className="text-lg font-medium">No departments found</p>
                        <p className="text-sm text-muted-foreground">
                          Add a new department to get started
                        </p>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
