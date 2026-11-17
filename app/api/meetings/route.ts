import { NextRequest, NextResponse } from 'next/server';
import type { SacramentMeeting } from '@/lib/types';
import {
  getMeetings,
  createMeeting,
} from '@/lib/meetings-db';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { message: 'Invalid date. Use YYYY-MM-DD.' },
      { status: 400 }
    );
  }

  try {
    const meetings = await getMeetings(date ?? undefined);

    return NextResponse.json({
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error('Get meetings error:', error);

    return NextResponse.json(
      { message: 'Unable to retrieve meetings.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as Omit<SacramentMeeting, 'id'>;

    if (
      !data.date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
      !['testimony', 'regular', 'stake', 'general'].includes(data.meetingType) ||
      !data.presiding?.trim() ||
      !data.conducting?.trim() ||
      !data.openingHymn?.title?.trim() ||
      !data.openingPrayer?.trim() ||
      !data.sacramentHymn?.title?.trim() ||
      !data.closingHymn?.title?.trim() ||
      !data.closingPrayer?.trim() ||
      !Array.isArray(data.speakers) ||
      !Array.isArray(data.wardBusiness)
    ) {
      return NextResponse.json(
        { message: 'Please provide all required meeting information.' },
        { status: 400 }
      );
    }

    const meeting = await createMeeting(data);

    return NextResponse.json(
      {
        message: 'Meeting created successfully.',
        meeting,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create meeting error:', error);

    return NextResponse.json(
      { message: 'Unable to create meeting.' },
      { status: 500 }
    );
  }
}
