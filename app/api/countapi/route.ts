import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0]; // Ensure today is in the correct format

    const { data, error } = await supabase
      .from("department")
      .select(
        `
    department_type,
    department_name,
    outpatientvisits: outpatientvisit(count),
    todayvisits: outpatientvisit(count).filter(visit_date,eq.${today}),
    male_visits: outpatientvisit(count).filter(outpatient_id, eq, outpatient.id).filter(outpatient.gender,eq.M),
    female_visits: outpatientvisit(count).filter(outpatient_id, eq, outpatient.id).filter(outpatient.gender,eq.F)
  `
      )
      .order("department_name");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch departments" },
        { status: 500 }
      );
    }

    const transformedData = data?.map((d: any) => ({
      department_name: d.department_name,
      department_type: d.department_type,
      total_visits_today: d.todayvisits?.[0]?.count || 0,
      total_visits_overall: d.outpatientvisits?.[0]?.count || 0,
      total_male_visits: d.male_visits?.[0]?.count || 0,
      total_female_visits: d.female_visits?.[0]?.count || 0, // Adjusted to handle femalevisits as an array
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
