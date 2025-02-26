"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Calendar } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCensusPDF = async () => {
    try {
      const response = await fetch("/api/census", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromDate, toDate }),
      });

      const data = await response.json();

      // Create PDF
      const doc = new jsPDF();

      // Header
      doc.setFontSize(16);
      doc.text(
        "Government Siddha Medical College - Tirunelveli",
        105,
        20,
        { align: "center" }
      );
      doc.setFontSize(14);
      doc.text("Weekly Census Report", 105, 30, { align: "center" });
      doc.text(`Period: ${fromDate} to ${toDate}`, 105, 40, { align: "center" });

      // Create table data
      const tableData = Object.entries(data).map(([date, counts]: [string, any]) => [
        new Date(date).toLocaleDateString(),
        counts.male,
        counts.female,
        counts.other,
        counts.total,
      ]);

      // Calculate totals
      const totals = tableData.reduce(
        (acc, row) => [
          "Total",
          acc[1] + row[1],
          acc[2] + row[2],
          acc[3] + row[3],
          acc[4] + row[4],
        ],
        ["Total", 0, 0, 0, 0]
      );

      // Add table
      doc.autoTable({
        startY: 50,
        head: [["Date", "Male", "Female", "Other", "Total"]],
        body: [...tableData, totals],
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        footStyles: { fillColor: [169, 169, 169] },
        styles: {
          fontSize: 12,
          cellPadding: 5,
          halign: "center",
        },
      });

      // Save PDF
      doc.save(`Census_Report_${fromDate}_to_${toDate}.pdf`);
    } catch (error) {
      console.error("Error generating census PDF:", error);
      alert("Error generating census report");
    }
  };

  const generateReport = () => {
    if (!fromDate || !toDate) {
      alert("Please select both from and to dates");
      return;
    }
    generateCensusPDF();
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="-ml-1" />
        <div className="container mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Generate Census Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="fromDate">From Date</Label>
                  <div className="relative">
                    <Input
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toDate">To Date</Label>
                  <div className="relative">
                    <Input
                      id="toDate"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={generateReport}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Generating..." : "Generate Census Report"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
