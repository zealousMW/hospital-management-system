// app/api/beds/route.js (or pages/api/beds.js - adjust based on your app directory structure)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';


export async function GET(req:NextRequest) {
    const supabase = await createClient();

    // Extract ward_id from the request URL (searchParams)
    const { searchParams } = new URL(req.url);
    const ward_id = searchParams.get('ward_id');

    if (!ward_id) {
        return NextResponse.json({ error: 'ward_id is required' }, { status: 400 });
    }

    try {
        const { data: beds, error } = await supabase
            .from('bed')
            .select(`
                bed_id,
                bed_number,
                is_occupied
            `)
            .eq('ward_id', ward_id);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(beds);

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}