import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const outpatient_id = searchParams.get("outpatient_id");

    if (!outpatient_id) {
      return NextResponse.json(
        { error: "Outpatient ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("outpatientvisit")
      .select(
        `
        visit_date,
        diagnosis,
        department:assigned_department (
          department_name
        )
      `
      )
      .eq("outpatient_id", outpatient_id)
      .not("diagnosis", "is", null)
      .order("visit_date", { ascending: false });

    if (error) throw error;

    // Add this console.log to debug the response
    //console.log('Visit history data:', data);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
