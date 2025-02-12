import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  // Extract ward_id from the request URL (searchParams)
  const { searchParams } = new URL(req.url);
  const ward_id = searchParams.get("ward_id");

  if (!ward_id) {
    return NextResponse.json({ error: "ward_id is required" }, { status: 400 });
  }

  try {
    const { data: beds, error } = await supabase
      .from("bed")
      .select(
        `
                bed_id,
                bed_number,
                is_occupied
            `
      )
      .eq("ward_id", ward_id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(beds);
  } catch (error) {
    console.error("Error occured getting beds:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, res: NextResponse) {
  const supabase = await createClient();

  try {
    const { bed_id } = await req.json();
    if (!bed_id) {
      return NextResponse.json(
        { error: "bed_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("bed")
      .update({ is_occupied: true })
      .eq("bed_id", bed_id)
      .select();

    if (error) {
      console.log(error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log("Error occured in updating beds:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
