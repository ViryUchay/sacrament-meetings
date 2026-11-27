
import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting, MeetingType, Hymn, SpeakerItem, WardBusinessItem } from './types';

// Create a Neon connection when a database operation is requested.
function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not configured.');
  }

  return neon(databaseUrl);
}

// Database record structure.
interface MeetingRow {
  id: number;
  date: string;
  meeting_type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: Hymn;
  opening_prayer: string;
  ward_business: WardBusinessItem[];
  stake_business: boolean;
  sacrament_hymn: Hymn;
  speakers: SpeakerItem[];
  closing_hymn: Hymn;
  closing_prayer: string;
}

// Convert a PostgreSQL record into the application TypeScript structure.
function mapMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date,
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

// Get all meetings, optionally filtered by date.
export async function getMeetings(
  date?: string
): Promise<SacramentMeeting[]> {
  const sql = getSql();

  const rows = date
    ? await sql`
        SELECT
          id,
          date::text AS date,
          meeting_type,
          presiding,
          conducting,
          announcements,
          opening_hymn,
          opening_prayer,
          ward_business,
          stake_business,
          sacrament_hymn,
          speakers,
          closing_hymn,
          closing_prayer
        FROM meetings
        WHERE date = ${date}::date
        ORDER BY date DESC
      `
    : await sql`
        SELECT
          id,
          date::text AS date,
          meeting_type,
          presiding,
          conducting,
          announcements,
          opening_hymn,
          opening_prayer,
          ward_business,
          stake_business,
          sacrament_hymn,
          speakers,
          closing_hymn,
          closing_prayer
        FROM meetings
        ORDER BY date DESC
      `;

  return (rows as unknown as MeetingRow[]).map(mapMeeting);
}

// Get one meeting by its ID.
export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | undefined> {
  const sql = getSql();

  const rows = await sql`
    SELECT
      id,
      date::text AS date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    FROM meetings
    WHERE id = ${id}
    LIMIT 1
  `;

  const meetings = rows as unknown as MeetingRow[];

  return meetings.length ? mapMeeting(meetings[0]) : undefined;
}

// Create a new meeting.
export async function createMeeting(
  meetingData: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  const sql = getSql();

  const rows = await sql`
    INSERT INTO meetings (
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    )
    VALUES (
      ${meetingData.date}::date,
      ${meetingData.meetingType},
      ${meetingData.presiding},
      ${meetingData.conducting},
      ${meetingData.announcements ?? []},
      ${JSON.stringify(meetingData.openingHymn)}::jsonb,
      ${meetingData.openingPrayer},
      ${JSON.stringify(meetingData.wardBusiness)}::jsonb,
      ${meetingData.stakeBusiness},
      ${JSON.stringify(meetingData.sacramentHymn)}::jsonb,
      ${JSON.stringify(meetingData.speakers)}::jsonb,
      ${JSON.stringify(meetingData.closingHymn)}::jsonb,
      ${meetingData.closingPrayer}
    )
    RETURNING
      id,
      date::text AS date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
  `;

  return mapMeeting((rows as unknown as MeetingRow[])[0]);
}

// Update an existing meeting.
export async function updateMeeting(
  id: number,
  meetingData: SacramentMeeting
): Promise<SacramentMeeting | undefined> {
  const sql = getSql();

  const rows = await sql`
    UPDATE meetings
    SET
      date = ${meetingData.date}::date,
      meeting_type = ${meetingData.meetingType},
      presiding = ${meetingData.presiding},
      conducting = ${meetingData.conducting},
      announcements = ${meetingData.announcements ?? []},
      opening_hymn = ${JSON.stringify(meetingData.openingHymn)}::jsonb,
      opening_prayer = ${meetingData.openingPrayer},
      ward_business = ${JSON.stringify(meetingData.wardBusiness)}::jsonb,
      stake_business = ${meetingData.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(meetingData.sacramentHymn)}::jsonb,
      speakers = ${JSON.stringify(meetingData.speakers)}::jsonb,
      closing_hymn = ${JSON.stringify(meetingData.closingHymn)}::jsonb,
      closing_prayer = ${meetingData.closingPrayer}
    WHERE id = ${id}
    RETURNING
      id,
      date::text AS date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
  `;

  const meetings = rows as unknown as MeetingRow[];

  return meetings.length ? mapMeeting(meetings[0]) : undefined;
}

// Delete a meeting.
export async function deleteMeeting(id: number): Promise<boolean> {
  const sql = getSql();

  const rows = await sql`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id
  `;

  return rows.length > 0;
}

// Search meetings and return one page of results.
export async function getMeetingsPage(
  search: string,
  page: number,
  pageSize: number = 5
): Promise<{
  meetings: SacramentMeeting[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  const sql = getSql();

  const searchTerm = search.trim();
  const searchPattern = `%${searchTerm}%`;

  // Count all meetings matching the search.
  const countRows = await sql`
    SELECT COUNT(*) AS total
    FROM meetings
    WHERE (
      ${searchTerm} = ''
      OR TO_CHAR(date, 'Month') ILIKE ${searchPattern}
      OR TO_CHAR(date, 'Mon') ILIKE ${searchPattern}
      OR date::text ILIKE ${searchPattern}
      OR meeting_type ILIKE ${searchPattern}
      OR presiding ILIKE ${searchPattern}
      OR conducting ILIKE ${searchPattern}
      OR announcements::text ILIKE ${searchPattern}
      OR opening_hymn::text ILIKE ${searchPattern}
      OR opening_prayer ILIKE ${searchPattern}
      OR ward_business::text ILIKE ${searchPattern}
      OR sacrament_hymn::text ILIKE ${searchPattern}
      OR speakers::text ILIKE ${searchPattern}
      OR closing_hymn::text ILIKE ${searchPattern}
      OR closing_prayer ILIKE ${searchPattern}
    )
  `;

  const totalCount = Number(
    (countRows[0] as { total: string | number }).total
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  // Keep the requested page within the available range.
  const currentPage =
    totalPages === 0
      ? 1
      : Math.min(Math.max(1, Math.floor(page)), totalPages);

  const offset = (currentPage - 1) * pageSize;

  // Retrieve only the meetings for the selected page.
  const rows = await sql`
    SELECT
      id,
      date::text AS date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    FROM meetings
    WHERE (
      ${searchTerm} = ''
      OR TO_CHAR(date, 'Month') ILIKE ${searchPattern}
      OR TO_CHAR(date, 'Mon') ILIKE ${searchPattern}
      OR date::text ILIKE ${searchPattern}
      OR meeting_type ILIKE ${searchPattern}
      OR presiding ILIKE ${searchPattern}
      OR conducting ILIKE ${searchPattern}
      OR announcements::text ILIKE ${searchPattern}
      OR opening_hymn::text ILIKE ${searchPattern}
      OR opening_prayer ILIKE ${searchPattern}
      OR ward_business::text ILIKE ${searchPattern}
      OR sacrament_hymn::text ILIKE ${searchPattern}
      OR speakers::text ILIKE ${searchPattern}
      OR closing_hymn::text ILIKE ${searchPattern}
      OR closing_prayer ILIKE ${searchPattern}
    )
    ORDER BY date DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  return {
    meetings: (rows as unknown as MeetingRow[]).map(mapMeeting),
    totalCount,
    totalPages,
    currentPage,
  };
}