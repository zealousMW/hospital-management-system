import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req:NextRequest) {
    const supabase = await createClient();

    const { searchParams } = new URL(req.url);
    const department_id = searchParams.get('department_id');
    if(department_id!==null){
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
        .eq('visit_date', new Date().toLocaleDateString('en-CA'))
        .eq('assigned_department',department_id)
        .not('assigned_department', 'is', null) // Change here
        .order('visit_date', { ascending: false });


    if (error) {
        console.error('GET: Error fetching visits:', error);
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
    

    
}

export async function PUT(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    const { visit_id, assigned_department, cause_of_visit } = body;

    if (!visit_id) {
        return NextResponse.json(
            { error: 'Visit ID is required' },
            { status: 400 }
        );
    }

    const { error } = await supabase
        .from('outpatientvisit')
        .update({
            assigned_department: assigned_department,
            cause_of_visit: cause_of_visit
        })
        .eq('visit_id', visit_id)
        .select();

    if (error) {
        console.error('PUT: Error updating visit:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Visit updated successfully' });
}