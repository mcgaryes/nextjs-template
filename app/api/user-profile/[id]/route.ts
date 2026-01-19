// create GET endpoint to fetch user profile by id
import { NextRequest, NextResponse } from 'next/server';
import { getUserProfileInformation } from '@/libs/features/user-profile/api/logic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const userProfile = await getUserProfileInformation(id);
        return NextResponse.json(userProfile, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
