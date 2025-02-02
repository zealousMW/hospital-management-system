import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: outpatientvisits, error } = await supabase
    .from('outpatientvisit')
    .select(`
      visit_id,
      visit_date,
      cause_of_visit,
      outpatient:outpatient (
        name,
        gender,
        age
      ),
      department:department (
        department_name
      )
    `)
    .order('visit_date', { ascending: false });

  if (error) {
    console.error('Error fetching visits:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedData = outpatientvisits?.map((visit: any) => ({
    visit_id: visit.visit_id,
    name: visit.outpatient?.name || "No name provided",
    age: visit.outpatient?.age || "Age not specified",
    gender: visit.outpatient?.gender || "Gender not specified",
    date_of_visit: visit.visit_date,
    department: visit.department?.department_name || "Not assigned",
    cause_of_visit: visit.cause_of_visit || "Not specified"
  })) || [];

  return NextResponse.json(formattedData);
}