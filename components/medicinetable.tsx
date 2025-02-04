"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Medicine {
    medicine_id: number,
    medicine_name: string,
    medicine_type: string,
    stock_quantity: string
}

const MedicineTable = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [newStock, setNewStock] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await fetch('/api/medicine');
                const data = await response.json();
                setMedicines(data);
            } catch (error) {
                console.error('Error fetching medicines:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, []);

    const filteredMedicines = medicines.filter(medicine =>
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
                const response = await fetch('/api/medicine', {
                    method: 'PUT',  // Changed from PATCH to PUT
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        medicine_id: selectedMedicine.medicine_id,
                        stock_quantity: parseInt(newStock) // Ensure it's a number
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to update stock');
                }

                const updatedMedicine = await response.json();
                
                // Refresh the medicines list after update
                const refreshResponse = await fetch('/api/medicine');
                const refreshedData = await refreshResponse.json();
                setMedicines(refreshedData);
                
                setSelectedMedicine(null);
            } catch (error) {
                console.error('Error updating stock:', error);
                alert('Failed to update stock. Please try again.');
            } finally {
                setUpdating(false);
            }
        }
    };

    return (
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
                                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : (
                            filteredMedicines.map((medicine) => (
                                <TableRow key={medicine.medicine_id}>
                                    <TableCell>{medicine.medicine_id}</TableCell>
                                    <TableCell>{medicine.medicine_name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{medicine.medicine_type}</Badge>
                                    </TableCell>
                                    <TableCell>{medicine.stock_quantity}</TableCell>
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
                                                        {updating ? 'Updating...' : 'Save Changes'}
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
    );
}

export default MedicineTable;