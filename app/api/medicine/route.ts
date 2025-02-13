import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: medicine, error } = await supabase.from("medicine").select("*");

  if (error) {
    console.error("Error fetching medicines:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedData = medicine.map((item) => ({
    medicine_id: item.medicine_id,
    medicine_name: item.medicine_name,
    medicine_type: item.medicine_type,
    stock_quantity: item.stock_quantity || "0",
    dosageUnit: item.unit,
  }));

  return NextResponse.json(formattedData);
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { action, dosage } = await req.json();
  const { searchParams } = new URL(req.url);
  const medicineId = searchParams.get("medicineId");

  if (!medicineId || !dosage || !action) {
    return NextResponse.json(
      { message: "Medicine ID and dosage are required" },
      { status: 400 }
    );
  }
  if (action === "reduceDosage") {
    try {
      // Fetch current stock
      const { data: medicine, error: fetchError } = await supabase
        .from("medicine")
        .select("stock_quantity")
        .eq("medicine_id", medicineId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!medicine) {
        return NextResponse.json(
          { message: "Medicine not found" },
          { status: 404 }
        );
      }

      const newStock =
        medicine.stock_quantity > dosage
          ? medicine.stock_quantity - dosage
          : medicine.stock_quantity;

      // Update stock
      const { error: updateError } = await supabase
        .from("medicine")
        .update({ stock_quantity: newStock })
        .eq("medicine_id", medicineId);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json(
        { message: "Stock updated successfully", newStock },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error updating stock:", error);
      return NextResponse.json(
        { message: "Failed to update stock", error: error.message },
        { status: 500 }
      );
    }
  }

  if (action === "addDosage" && dosage >= 0) {
    try {
      const { error: updateError } = await supabase
        .from("medicine")
        .update({ stock_quantity: dosage })
        .eq("medicine_id", medicineId);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json(
        { message: "Stock updated successfully", dosage },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error updating stock:", error);
      return NextResponse.json(
        { message: "Failed to update stock", error: error.message },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Action required or Dosage value error" },
      { status: 400 }
    );
  }
}
