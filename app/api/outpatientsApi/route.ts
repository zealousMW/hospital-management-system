import { createClient } from '@supabase/supabase-js';
import { NextRequest,NextResponse } from 'next/server';

const supabase = createClient(
    "https://ivqcojygxyvcuknihkcl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cWNvanlneHl2Y3Vrbmloa2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzEyNjYsImV4cCI6MjA1MTU0NzI2Nn0.6pLDWq0z_0udp_X2phg0Nvo_6iRgvL0RNwgfUbuFYD0"
);

const tableName="outpatient";

export async function GET() {
    try {
        const { data, error } = await supabase.from(tableName).select("*");
        if (error) throw error;
    
        return NextResponse.json(data, { status: 200 });
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { outpatient_id, ...updateData } = body; 

    if (!outpatient_id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(tableName) 
      .update(updateData)
      .eq("outpatient_id", outpatient_id)
      .select(); 

    if (error) throw error;

    return NextResponse.json({ message: "Data updated", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, number, place, gender, age } = body;

    if (!name || !number || !place || !gender || !age) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(tableName) 
      .insert([{ name, number, place, age, gender }])
      .select(); 

    if (error) throw error;

    return NextResponse.json({ message: "Data created successfully", data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { outpatient_id } = body;

    if (!outpatient_id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from(tableName) 
      .delete()
      .eq("outpatient_id", outpatient_id);

    if (error) throw error;

    return NextResponse.json({ message: "Data deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
