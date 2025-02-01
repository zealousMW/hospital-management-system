import { createClient } from '@supabase/supabase-js';
import { NextRequest,NextResponse } from 'next/server';

const supabase = createClient(
    "https://ivqcojygxyvcuknihkcl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cWNvanlneHl2Y3Vrbmloa2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzEyNjYsImV4cCI6MjA1MTU0NzI2Nn0.6pLDWq0z_0udp_X2phg0Nvo_6iRgvL0RNwgfUbuFYD0"
);

const tableName="outpatientvisit";

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { outpatient_id, visit_date, visit_time, cause_of_visit, assigned_department } = body;
  
      if (!outpatient_id || !visit_date || !visit_time || !cause_of_visit || !assigned_department) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }
  
      const { data, error } = await supabase
        .from(tableName) 
        .insert([{ outpatient_id, visit_date, visit_time, cause_of_visit, assigned_department }])
        .select();
  
      if (error) throw error;
  
      return NextResponse.json({ message: "Visit created successfully", data }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
  export async function GET() {
    try {
      const { data, error } = await supabase.from(tableName).select("*"); 
  
      if (error) throw error;
  
      return NextResponse.json( data , { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
  
  export async function PATCH(req: NextRequest) {
    try {
      const body = await req.json();
      const { visit_id, ...updateData } = body; 
  
      if (!visit_id) {
        return NextResponse.json({ error: "visit_id is required" }, { status: 400 });
      }
  
      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq("visit_id", visit_id)
        .select();
  
      if (error) throw error;
  
      return NextResponse.json({ message: "Visit updated successfully", data }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  export async function DELETE(req: NextRequest) {
    try {
      const body = await req.json();
      const { visit_id } = body;
  
      if (!visit_id) {
        return NextResponse.json({ error: "visit_id is required" }, { status: 400 });
      }
  
      const { error } = await supabase.from(tableName).delete().eq("visit_id", visit_id);
  
      if (error) throw error;
  
      return NextResponse.json({ message: "Visit deleted successfully" }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }