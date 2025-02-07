import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  "https://ivqcojygxyvcuknihkcl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cWNvanlneHl2Y3Vrbmloa2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzEyNjYsImV4cCI6MjA1MTU0NzI2Nn0.6pLDWq0z_0udp_X2phg0Nvo_6iRgvL0RNwgfUbuFYD0"
);

const tableName = "outpatientvisit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paramValue = searchParams.get("outpatientvisit_id");
    const { data, error } = await supabase
      .from(tableName)
      .select("outpatient(*)")
      .eq("visit_id", paramValue);
    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
