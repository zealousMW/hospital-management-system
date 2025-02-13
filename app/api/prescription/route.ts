import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const visitId = searchParams.get("visitId");
  const { data: prescription, error } = await supabase
    .from("prescription")
    .select(
      `
        *,
        outpatientvisit (
            outpatient (*)
        )
    `
    )
    .eq("visit_id", visitId);

  if (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedData = prescription.map((item) => ({
    prescription_id: item.prescription_id,
    visit_id: item.visit_id,
    medicine_id: item.medicine_id,
    dosage: item.dosage,
    dosage_type: item.dosage_type,
    dosage_timing: item.dosage_timing,
    outpatient: item.outpatientvisit.outpatient,
  }));

  return NextResponse.json(formattedData);
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const prescriptionId = searchParams.get("prescriptionId");
  const { is_received } = await req.json();

  if (!prescriptionId) {
    return NextResponse.json(
      { message: "Prescription ID is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("prescription")
      .update({ is_received })
      .eq("prescription_id", prescriptionId);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Prescription updated successfully", data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating prescription:", error);
    return NextResponse.json(
      { message: "Failed to update prescription", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  try {
    // Extract single prescription data from request body
    const { medicine_id, dosage, dosage_timing, prescription_date, dosage_type, visit_id, inpatient_id } =
      await req.json();

    if (!medicine_id) {
      return NextResponse.json(
        { message: "Visit ID and medication are required." },
        { status: 400 }
      );
    }

    let data;

    if (!inpatient_id) {
      const result = await supabase
      .from("prescription")
      .insert({
        medicine_id,
        dosage,
        dosage_timing,
        prescription_date,
        visit_id,
        dosage_type,
      })
      .select()
      .single();

      data = result.data;

      if (result.error) {
        throw result.error;
      }
    } else {
      const result = await supabase
      .from("prescription")
      .insert({
        medicine_id,
        dosage,
        dosage_timing,
        prescription_date,
        inpatient_id,
        dosage_type,
      })
      .select()
      .single();

      data = result.data;

      if (result.error) {
        throw result.error;
      }
    }

    return NextResponse.json(
      { message: "Prescription added successfully", data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding prescription:", error);
    return NextResponse.json(
      { message: "Failed to add prescription", error: error.message },
      { status: 500 }
    );
  }
}
