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
    outpatientvisit (
      visit_date,
      outpatient_id,
      outpatient (gender,age)
      
    )
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
    interface OutpatientVisit {
      visit_date: string;
      outpatient?: {
        gender: string;
        age: number;
      };
    }

    const transformedData = data?.map((d: any) => {
      const visits = d.outpatientvisit || [];

      const totalVisitsToday = visits.filter(
        (v: OutpatientVisit) => v.visit_date === today
      ).length;
      const totalOldvisits = visits.length - totalVisitsToday;
      const totalMaleVisits = visits.filter(
        (v: OutpatientVisit) => v.outpatient?.gender === "M"
      ).length;
      const totalFemaleVisits = visits.filter(
        (v: OutpatientVisit) => v.outpatient?.gender === "F"
      ).length;
      const totalChildVisits = visits.filter(
        (v: OutpatientVisit) =>
          v.outpatient?.age !== undefined && v.outpatient.age < 12
      ).length;
      const totalAdultVisits = visits.filter(
        (v: OutpatientVisit) =>
          v.outpatient?.age !== undefined && v.outpatient.age >= 12
      ).length;

      return {
        department_name: d.department_name,
        department_type: d.department_type,
        total_old_visits: totalOldvisits,
        total_visits_today: totalVisitsToday,
        total_visits_overall: visits.length,
        total_male_visits: totalMaleVisits,
        total_female_visits: totalFemaleVisits,
        total_child_visits: totalChildVisits,
        total_adult_visits: totalAdultVisits,
      };
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
