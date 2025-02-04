import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('department')
            .select(`
                department_name,
                outpatientvisits:outpatientvisit(count),
                todayvisits:outpatientvisit(count).filter(visit_date.eq.${today}),
                malevisits:outpatientvisit(count).filter(outpatient(gender).eq.M),
                femalevisits:outpatientvisit(count).filter(outpatient(gender).eq.F)
            `)
            .order('department_name');

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
        }

        const transformedData = data?.map((d: any) => ({
            department_name: d.department_name,
            total_visits_today: d.todayvisits[0]?.count || 0,
            total_visits_overall: d.outpatientvisits[0]?.count || 0,
            total_male_visits: d.malevisits[0]?.count || 0,
            total_female_visits: d.femalevisits[0]?.count || 0,
        }));

        return NextResponse.json(transformedData);
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}