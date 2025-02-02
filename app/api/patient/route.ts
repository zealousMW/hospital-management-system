import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  let number = req.nextUrl.searchParams.get("number");
  if (!number) {
    return NextResponse.json({ message: "Please provide a number!" });
  }
  let suggests= supabase
  .from('outpatient')
 .select('*');

 if(suggests){
  suggests = suggests.ilike('number', `${number}%`);
 }

 const { data: outpatients, error } = await suggests;
  if (error) {
    console.error('Error fetching visits:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ outpatients });
} 