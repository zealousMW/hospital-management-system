// app/api/wards/route.js (or pages/api/wards.js - adjust based on your app directory structure)
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';


export async function GET(req: NextRequest) {
    const supabase = await createClient();

    // Extract department_id from the request URL (searchParams)
    const { searchParams } = new URL(req.url);
    const department_id = searchParams.get('department_id');

    if (!department_id) {
        return NextResponse.json({ error: 'department_id is required' }, { status: 400 });
    }

    try {
        const { data: wards, error } = await supabase
            .from('ward')
            .select(`
                ward_id,
                ward_name,
                ward_type,
                gender,
                number_of_beds
            `)
            .eq('department_id', department_id);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(wards);

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}