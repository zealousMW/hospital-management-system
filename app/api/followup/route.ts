import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET endpoint to fetch follow-up records
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const inpatientId = searchParams.get("inpatient_id");

  const { data: followups, error } = await supabase
    .from("followup")
    .select("*")
    .eq("inpatient_id", inpatientId)
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(followups);
}

// POST endpoint to create new follow-up record
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  try {
    const { description, inpatient_id, advice } = await req.json();

    if (!inpatient_id) {
      return NextResponse.json(
        { message: "Inpatient ID is required" },
        { status: 400 }
      );
    }

    // Create a proper date string in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from("followup")
      .insert({
        description: description || null, // Handle empty description
        inpatient_id: parseInt(inpatient_id), // Ensure proper number format
        advice: advice || null, // Handle empty advice
        date: currentDate,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json(
      { message: "Follow-up record created successfully", data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Full error details:", error);
    return NextResponse.json(
      { 
        message: "Failed to create follow-up record", 
        error: error.message,
        details: error.details || error
      },
      { status: 500 }
    );
  }
}
