import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const searchTerm = req.nextUrl.searchParams.get("number") || '';
  
  if (!searchTerm) {
    return NextResponse.json({ message: "Please provide a search term!" });
  }

  const { data: outpatients, error } = await supabase
    .from('outpatient')
    .select('*')
    .or(`number.ilike.${searchTerm}%,name.ilike.%${searchTerm}%`)
    .limit(5);

  if (error) {
    console.error('Error fetching visits:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ outpatients });
}