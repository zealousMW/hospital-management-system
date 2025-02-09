import { NextResponse } from "next/server";
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

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { medicine_id, stock_quantity } = body;

    if (!medicine_id || stock_quantity === undefined) {
      return NextResponse.json({
        success: false,
        error: "Medicine ID and stock quantity are required",
      });
    }

    const { data, error } = await supabase
      .from("medicine")
      .update({
        stock_quantity: stock_quantity.toString(),
      })
      .eq("medicine_id", medicine_id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}
