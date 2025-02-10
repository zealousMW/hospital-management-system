"use client";

import React, { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Medicine {
  medicine_id: number;
  medicine_name: string;
  medicine_type: string;
  stock_quantity: string;
  dosageUnit: string;
}

const MedicineTable = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [stockwarning, setStockWarning] = useState<Medicine[]>([]);
  const [isStockWarning, setIsStockWarning] = useState(false);
  const [newStock, setNewStock] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("/api/medicine");
        const data = await response.json();
        setMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    if (!loading && medicines.length > 0) {
      stockWarningCheck();
    }
  }, [medicines, loading]);

  const stockWarningCheck = () => {
    const lowStockMedicines = medicines.filter(
      (medicine) => parseInt(medicine.stock_quantity) < 10
    );
    setStockWarning(lowStockMedicines);
    setIsStockWarning(lowStockMedicines.length > 0);
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStock = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setNewStock(medicine.stock_quantity);
  };

  const saveStockUpdate = async () => {
    if (selectedMedicine) {
      setUpdating(true);
      try {
        const response = await fetch("/api/medicine", {
          method: "PUT", // Changed from PATCH to PUT
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicine_id: selectedMedicine.medicine_id,
            stock_quantity: parseInt(newStock), // Ensure it's a number
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update stock");
        }

        const updatedMedicine = await response.json();

        // Refresh the medicines list after update
        const refreshResponse = await fetch("/api/medicine");
        const refreshedData = await refreshResponse.json();
        setMedicines(refreshedData);

        setSelectedMedicine(null);
      } catch (error) {
        console.error("Error updating stock:", error);
        alert("Failed to update stock. Please try again.");
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <>
      {isStockWarning && (
        <div className="notifications-container p-4 w-full">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900">
              Stock Warnings
            </h3>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {stockwarning.length}
            </span>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {stockwarning.map((medicine) => (
              <div
                key={medicine.medicine_id}
                className={`
        ${
          parseInt(medicine.stock_quantity) < 5
            ? "bg-red-100 text-red-800 border-red-300"
            : "bg-yellow-100 text-yellow-800 border-yellow-300"
        } 
        p-4 rounded-lg shadow-sm hover:shadow-md transition-all
      `}
              >
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                    />
                  </svg>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium text-gray-900">
                        {medicine.medicine_name}
                      </h4>
                      <span className="text-xs text-gray-600">
                        Only {medicine.stock_quantity}
                        <span className="text-xs text-gray-600">
                          {medicine.dosageUnit}
                        </span>{" "}
                        left
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-gray-700">
                      The stock for <strong>{medicine.medicine_name}</strong> is
                      low. Please reorder soon to avoid shortages.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setStockWarning((prev) =>
                        prev.filter(
                          (m) => m.medicine_id !== medicine.medicine_id
                        )
                      )
                    }
                    className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-300 px-2 py-1 rounded"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Medicines Directory</CardTitle>
          <Input
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-[300px]"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.medicine_id}>
                    <TableCell>{medicine.medicine_id}</TableCell>
                    <TableCell>{medicine.medicine_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{medicine.medicine_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {medicine.stock_quantity} {medicine.dosageUnit}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStock(medicine)}
                          >
                            Update Stock
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Stock</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label>New Stock Amount</Label>
                              <Input
                                type="number"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                            <Button
                              onClick={saveStockUpdate}
                              disabled={updating}
                            >
                              {updating ? "Updating..." : "Save Changes"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default MedicineTable;
