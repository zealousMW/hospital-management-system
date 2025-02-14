import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  try {
    // Fetch outpatient visits where medicine was dispensed
    const { data: visits, error: visitError } = await supabase
      .from("outpatientvisit")
      .select("visit_id, outpatient_id(name), visit_date")
      .eq("medicine_dispensed", true);

    if (visitError) {
      console.error("Error fetching visits:", visitError.message);
      return NextResponse.json({ error: visitError.message }, { status: 500 });
    }

    // Fetch prescriptions for each visit_id
    const prescriptionsPromises = visits.map(async (visit) => {
      const { data: prescriptions, error: prescriptionError } = await supabase
        .from("prescription")
        .select("*")
        .eq("visit_id", visit.visit_id);

      if (prescriptionError) {
        console.error(
          "Error fetching prescriptions:",
          prescriptionError.message
        );
        return { visit, prescriptions: [] }; // Return empty if error
      }

      return { visit, prescriptions };
    });

    const history = await Promise.all(prescriptionsPromises);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
