import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { fromDate, toDate } = await req.json();
    const supabase = await createClient();

    const { data: visitData, error } = await supabase
      .from('outpatientvisit')
      .select(`
        visit_date,
        outpatient (
          gender
        )
      `)
      .gte('visit_date', fromDate)
      .lte('visit_date', toDate)
      .order('visit_date', { ascending: true });

    if (error) throw error;

    // Process data into daily counts
    const dailyCounts = visitData.reduce((acc: any, visit:any) => {
      const date = visit.visit_date;
      if (!acc[date]) {
        acc[date] = { male: 0, female: 0, other: 0, total: 0 };
      }
      
      const gender = visit.outpatient.gender;
      if (gender === 'M') acc[date].male++;
      else if (gender === 'F') acc[date].female++;
      else acc[date].other++;
      acc[date].total++;
      
      return acc;
    }, {});

    return NextResponse.json(dailyCounts);
  } catch (error) {
    console.error("Error generating census:", error);
    return NextResponse.json(
      { error: "Failed to generate census report" },
      { status: 500 }
    );
  }
}
