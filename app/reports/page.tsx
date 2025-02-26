"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const generateCensusPDF = async () => {
    try {
      const response = await fetch("/api/census", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fromDate: fromDate?.toISOString().split('T')[0], 
          toDate: toDate?.toISOString().split('T')[0] 
        }),
      });

      const data = await response.json();

      // Create PDF
      const doc = new jsPDF();

      // Format dates for PDF header and filename
      const formattedFromDate = format(fromDate!, 'dd-MM-yyyy');
      const formattedToDate = format(toDate!, 'dd-MM-yyyy');

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
      doc.text(`Period: ${formattedFromDate} to ${formattedToDate}`, 105, 40, { align: "center" });

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

      // Save PDF with formatted date in filename
      doc.save(`Census_Report_${formattedFromDate}_to_${formattedToDate}.pdf`);
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
      style={{ "--sidebar-width": "19rem" } as React.CSSProperties}
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
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
