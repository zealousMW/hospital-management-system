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
    // Extract prescription data from request body
    const { medicine_ids, dosage, dosage_timing, dosage_type, visit_id } =
      await req.json();

    if (!visit_id || medicine_ids.length === 0) {
      return NextResponse.json(
        { message: "Visit ID and at least one medication are required." },
        { status: 400 }
      );
    }

    // Prepare data to insert multiple prescriptions
    const prescriptionsToInsert = medicine_ids.map(
      (medicine_id: number, index: number) => ({
        medicine_id,
        dosage: dosage[index],
        dosage_timing: dosage_timing[index],
        dosage_type: dosage_type[index],
        visit_id,
      })
    );

    // Insert data into prescription table
    const { data, error } = await supabase
      .from("prescription")
      .insert(prescriptionsToInsert);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Prescriptions added successfully", data },
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
