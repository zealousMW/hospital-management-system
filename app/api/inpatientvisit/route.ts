import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const tableName = "inpatient";

const handleError = (error: any, status = 500) => {
    console.error('API Error:', error);
    return NextResponse.json({
        error: error.message || 'Internal server error',
        status: status
    }, { status });
};

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();

        // Input validation
        const requiredFields = ['ward_id', 'admission_date'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return handleError({
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, 400);
        }

        let {
            outpatient_id,
            ward_id,
            bed_id,
            aadhaar_number,
            address,
            admission_date,
            admission_time,
            attender_name,
            attender_relationship,
            attender_contact_number,
            attender_address,
            attender_ward_id,
            attender_bed_id,
            name,
            number,
            age
        } = body;

        if (!outpatient_id) {
            // Create Outpatient using name, number, age, and address for place
            if (!name || !number || !age || !address) {
                return handleError({ message: "Outpatient details (name, number, age, address) are required when outpatient_id is not provided" }, 400);
            }

            const { data: outpatient, error } = await supabase
                .from('outpatient')
                .insert([{ name, number, age, place: address, gender: "O" }])
                .select('outpatient_id');

            if (error) throw error;

            outpatient_id = outpatient[0].outpatient_id;
        }

        const { data, error } = await supabase
            .from(tableName)
            .insert([
                {
                    outpatient_id,
                    ward_id,
                    bed_id,
                    aadhaar_number,
                    address,
                    admission_date,
                    admission_time,
                    attender_name,
                    attender_relationship,
                    attender_contact_number,
                    attender_address,
                    attender_ward_id,
                    attender_bed_id,
                },
            ])
            .select();

        if (error) throw error;
        const { error: bedUpdateError } = await supabase
        .from('bed')
        .update({ is_occupied: true })
        .eq('bed_id', bed_id);

    if (bedUpdateError) {
        console.error("Error updating bed status:", bedUpdateError);
        // Optionally, you could rollback the inpatient creation here if the bed update fails
        // For simplicity, I'm just logging the error and continuing
    }

        return NextResponse.json({
            message: "Inpatient record created successfully",
            data
        }, { status: 201 });
    } catch (error: any) {
        return handleError(error);
    }
}

export async function GET() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from(tableName)
            .select(`
                *,
                outpatient (
                    name,
                    age,
                    gender
                )
            `);

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return handleError(error);
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { inpatient_id, ...updateData } = body;

        if (!inpatient_id) {
            return handleError({ message: "inpatient_id is required" }, 400);
        }

        const { data, error } = await supabase
            .from(tableName)
            .update(updateData)
            .eq("inpatient_id", inpatient_id)
            .select();

        if (error) throw error;

        return NextResponse.json({ message: "Inpatient record updated successfully", data }, { status: 200 });
    } catch (error: any) {
        return handleError(error);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { inpatient_id } = body;

        if (!inpatient_id) {
            return handleError({ message: "inpatient_id is required" }, 400);
        }

        const { error } = await supabase.from(tableName).delete().eq("inpatient_id", inpatient_id);

        if (error) throw error;

        return NextResponse.json({ message: "Inpatient record deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return handleError(error);
    }
}