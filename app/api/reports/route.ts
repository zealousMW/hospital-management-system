import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { fromDate, toDate, reportType } = await req.json();
    const supabase = await createClient();

    let data;
    switch (reportType) {
      case "patient":
        const { data: patientData, error: patientError } = await supabase
          .from("outpatientvisit")
          .select(
            `
            *,
            outpatient (
              name,
              gender,
              age
            ),
            department (
              department_name
            )
          `
          )
          .gte("visit_date", fromDate)
          .lte("visit_date", toDate);

        if (patientError) throw patientError;
        data = patientData;
        break;

      case "department":
        const { data: deptData, error: deptError } = await supabase
          .from("department")
          .select(
            `
            *,
            outpatientvisit (
              visit_date,
              outpatient (
                gender,
                age
              )
            )
          `
          )
          .gte("outpatientvisit.visit_date", fromDate)
          .lte("outpatientvisit.visit_date", toDate);

        if (deptError) throw deptError;
        data = deptData;
        break;

      case "medicine":
        const { data: medData, error: medError } = await supabase
          .from("prescription")
          .select(
            `
            *,
            medicine (
              medicine_name,
              stock
            )
          `
          )
          .gte("created_at", fromDate)
          .lte("created_at", toDate);

        if (medError) throw medError;
        data = medData;
        break;

      default:
        throw new Error("Invalid report type");
    }

    // Process the data to generate statistics
    const statistics = processReportData(data, reportType);

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

function processReportData(data: any[], reportType: string) {
  // Process the data based on report type
  // This is a basic example - enhance based on your needs
  switch (reportType) {
    case "patient":
      return {
        totalPatients: data.length,
        malePatients: data.filter((d) => d.outpatient?.gender === "M").length,
        femalePatients: data.filter((d) => d.outpatient?.gender === "F").length,
        childPatients: data.filter((d) => d.outpatient?.age < 12).length,
        adultPatients: data.filter((d) => d.outpatient?.age >= 12).length,
        // Add more statistics as needed
      };

    case "department":
      // Process department statistics
      return {
        departmentStats: data.map((dept) => ({
          name: dept.department_name,
          totalVisits: dept.outpatientvisit?.length || 0,
          // Add more department-specific stats
        })),
      };

    case "medicine":
      // Process medicine usage statistics
      return {
        medicineStats: data.reduce((acc: any, curr) => {
          const medName = curr.medicine.medicine_name;
          acc[medName] = (acc[medName] || 0) + 1;
          return acc;
        }, {}),
      };

    default:
      return {};
  }
}
