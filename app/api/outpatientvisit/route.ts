import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const tableName = "outpatientvisit";

const handleError = (error: any, status = 500) => {
  console.error("API Error:", error);
  return NextResponse.json(
    {
      error: error.message || "Internal server error",
      status: status,
    },
    { status }
  );
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    // Input validation
    const requiredFields = [
      "visit_date",
      "visit_time",
      "name",
      "number",
      "age",
      "place",
      "gender",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return handleError(
        {
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        400
      );
    }

    let {
      outpatient_id,
      visit_date,
      visit_time,
      name,
      number,
      age,
      place,
      gender,
    } = body;

    if (!outpatient_id) {
      const { data: outpatient, error } = await supabase
        .from("outpatient")
        .insert([{ name, number, age, place, gender }])
        .select("outpatient_id");
      if (error) throw error;
      outpatient_id = outpatient[0].outpatient_id;

      const { data: visit, error: visitError } = await supabase
        .from(tableName)
        .insert([
          {
            outpatient_id: outpatient_id,
            visit_date,
            visit_time,
            cause_of_visit: null,
            assigned_department: null,
          },
        ])
        .select("visit_id");
      if (visitError) throw visitError;
    } else {
      const { data: visit, error: visitError } = await supabase
        .from(tableName)
        .insert([
          {
            outpatient_id,
            visit_date,
            visit_time,
            cause_of_visit: null,
            assigned_department: null,
          },
        ])
        .select("visit_id");
      if (visitError) throw visitError;
    }

    return NextResponse.json(
      {
        message: "Visit created successfully",
        status: 201,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from(tableName).select("*").eq("medicine_dispensed", "FALSE").neq("diagnosis", "NULL");

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { visit_id, ...updateData } = body;

    if (!visit_id) {
      return handleError({ message: "visit_id is required" }, 400);
    }

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq("visit_id", visit_id)
      .select();

    if (error) throw error;

    return NextResponse.json(
      { message: "Visit updated successfully", data },
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { visit_id } = body;

    if (!visit_id) {
      return handleError({ message: "visit_id is required" }, 400);
    }

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("visit_id", visit_id);

    if (error) throw error;

    return NextResponse.json(
      { message: "Visit deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error);
  }
}
