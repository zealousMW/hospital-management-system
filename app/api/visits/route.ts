import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const supabase = await createClient();

  const query = supabase
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

  // Add date range filter if dates are provided
  if (startDate && endDate) {
    query.gte('visit_date', startDate).lte('visit_date', endDate);
  } else {
    // Default to today if no dates provided
    query.eq('visit_date', new Date().toISOString().split('T')[0]);
  }

  const { data: outpatientvisits, error } = await query;

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