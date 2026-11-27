
import { NextResponse } from 'next/server';
import type { SacramentMeeting } from '@/lib/types';
import {
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from '@/lib/meetings-db';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    return NextResponse.json(
      { message: 'Invalid meeting ID.' },
      { status: 400 }
    );
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    return NextResponse.json(
      { message: 'Meeting not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json(meeting);
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    return NextResponse.json(
      { message: 'Invalid meeting ID.' },
      { status: 400 }
    );
  }

  try {
    const data = await request.json() as SacramentMeeting;

    if (
      !data.date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
      !['testimony', 'regular', 'stake', 'general', 'special'].includes(data.meetingType) ||
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

    const meeting = await updateMeeting(meetingId, data);

    if (!meeting) {
      return NextResponse.json(
        { message: 'Meeting not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Meeting updated successfully.',
      meeting,
    });
  } catch {
    return NextResponse.json(
      { message: 'Invalid meeting data.' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    return NextResponse.json(
      { message: 'Invalid meeting ID.' },
      { status: 400 }
    );
  }

  const deleted = await deleteMeeting(meetingId);

  if (!deleted) {
    return NextResponse.json(
      { message: 'Meeting not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: 'Meeting deleted successfully.',
  });
}
