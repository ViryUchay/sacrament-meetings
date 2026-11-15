
import type { SacramentMeeting } from './types';
import fs from 'node:fs';
import path from 'node:path';

const initialMeetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-11-08',
    meetingType: 'testimony',
    presiding: 'Bishop Daniel',
    conducting: 'Brother Samuel',
    announcements: [
      'Ward choir practice will hold on Wednesday.',
      'Youth activity is scheduled for Saturday.',
    ],
    openingHymn: {
      number: 2,
      title: 'The Spirit of God',
    },
    openingPrayer: 'Sister Grace',
    wardBusiness: [
      { description: 'Sustain newly called ward officers.' },
      { description: 'Announce the upcoming ward activity.' },
    ],
    stakeBusiness: false,
    sacramentHymn: {
      number: 169,
      title: 'As Now We Take the Sacrament',
    },
    speakers: [
      {
        name: 'Brother Michael',
        topic: 'Gratitude and Faith',
        type: 'speaker',
      },
      {
        name: 'Sister Ruth',
        topic: 'Personal Testimony',
        type: 'speaker',
      },
    ],
    closingHymn: {
      number: 30,
      title: 'Come, Come, Ye Saints',
    },
    closingPrayer: 'Brother Peter',
  },
  {
    id: 2,
    date: '2026-11-01',
    meetingType: 'regular',
    presiding: 'Bishop Daniel',
    conducting: 'Brother Samuel',
    announcements: ['Family history activity next Sunday.'],
    openingHymn: {
      number: 19,
      title: 'We Thank Thee, O God, for a Prophet',
    },
    openingPrayer: 'Brother James',
    wardBusiness: [
      { description: 'Ward council updates.' },
    ],
    stakeBusiness: false,
    sacramentHymn: {
      number: 185,
      title: 'Reverently and Meekly Now',
    },
    speakers: [
      {
        name: 'Sister Mary',
        topic: 'The Importance of Prayer',
        type: 'speaker',
      },
      {
        name: 'Ward Choir',
        topic: 'Musical Selection',
        type: 'musical-number',
      },
      {
        name: 'Brother John',
        topic: 'Following Jesus Christ',
        type: 'speaker',
      },
    ],
    closingHymn: {
      number: 134,
      title: 'I Believe in Christ',
    },
    closingPrayer: 'Sister Esther',
  },
  {
    id: 3,
    date: '2026-10-25',
    meetingType: 'regular',
    presiding: 'Bishop Daniel',
    conducting: 'Brother David',
    announcements: ['Youth conference registration is open.'],
    openingHymn: {
      number: 3,
      title: 'Now Let Us Rejoice',
    },
    openingPrayer: 'Sister Anna',
    wardBusiness: [
      { description: 'Announcements from the Relief Society.' },
    ],
    stakeBusiness: true,
    sacramentHymn: {
      number: 188,
      title: 'Thy Will, O Lord, Be Done',
    },
    speakers: [
      {
        name: 'Brother Paul',
        topic: 'Service and Discipleship',
        type: 'speaker',
      },
      {
        name: 'Sister Elizabeth',
        topic: 'Building Strong Families',
        type: 'speaker',
      },
    ],
    closingHymn: {
      number: 152,
      title: 'God Be with You Till We Meet Again',
    },
    closingPrayer: 'Brother Joseph',
  },
  {
    id: 4,
    date: '2026-10-18',
    meetingType: 'stake',
    presiding: 'Stake President Johnson',
    conducting: 'Brother David',
    announcements: ['Stake leadership training will follow.'],
    openingHymn: {
      number: 27,
      title: 'Praise to the Man',
    },
    openingPrayer: 'Brother Andrew',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: {
      number: 190,
      title: 'In Memory of the Crucified',
    },
    speakers: [
      {
        name: 'President Johnson',
        topic: 'Strengthening Stake Unity',
        type: 'speaker',
      },
    ],
    closingHymn: {
      number: 98,
      title: 'I Need Thee Every Hour',
    },
    closingPrayer: 'Sister Helen',
  },
  {
    id: 5,
    date: '2026-10-11',
    meetingType: 'general',
    presiding: 'Elder Williams',
    conducting: 'Brother David',
    announcements: ['Regional conference information.'],
    openingHymn: {
      number: 87,
      title: 'With Songs of Praise',
    },
    openingPrayer: 'Sister Ruth',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: {
      number: 188,
      title: 'Thy Will, O Lord, Be Done',
    },
    speakers: [
      {
        name: 'Elder Williams',
        topic: 'Faith in Jesus Christ',
        type: 'speaker',
      },
      {
        name: 'Choir',
        topic: 'Musical Number',
        type: 'musical-number',
      },
    ],
    closingHymn: {
      number: 85,
      title: 'How Firm a Foundation',
    },
    closingPrayer: 'Brother Mark',
  },
];

// Local JSON storage
const dataDirectory = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDirectory, 'meetings.json');

// Read meetings from the JSON file.
// Create the file with sample data if it does not exist.
function readMeetings(): SacramentMeeting[] {
  if (!fs.existsSync(dataFile)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
    fs.writeFileSync(
      dataFile,
      JSON.stringify(initialMeetings, null, 2),
      'utf8'
    );
  }

  const fileContent = fs.readFileSync(dataFile, 'utf8');

  return JSON.parse(fileContent) as SacramentMeeting[];
}

// Save meetings to the JSON file.
function saveMeetings(data: SacramentMeeting[]): void {
  fs.mkdirSync(dataDirectory, { recursive: true });

  fs.writeFileSync(
    dataFile,
    JSON.stringify(data, null, 2),
    'utf8'
  );
}

// Get all meetings, optionally filtered by date.
export function getMeetings(date?: string): SacramentMeeting[] {
  const allMeetings = readMeetings();

  if (date) {
    return allMeetings.filter((meeting) => meeting.date === date);
  }

  return [...allMeetings].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

// Get one meeting by its ID.
export function getMeetingById(
  id: number
): SacramentMeeting | undefined {
  return readMeetings().find((meeting) => meeting.id === id);
}

// Create a new meeting.
export function createMeeting(
  meetingData: Omit<SacramentMeeting, 'id'>
): SacramentMeeting {
  const allMeetings = readMeetings();

  const newMeeting: SacramentMeeting = {
    ...meetingData,
    id: allMeetings.length
      ? Math.max(...allMeetings.map((meeting) => meeting.id)) + 1
      : 1,
  };

  saveMeetings([...allMeetings, newMeeting]);

  return newMeeting;
}

// Update an existing meeting.
export function updateMeeting(
  id: number,
  meetingData: SacramentMeeting
): SacramentMeeting | undefined {
  const allMeetings = readMeetings();

  const index = allMeetings.findIndex(
    (meeting) => meeting.id === id
  );

  if (index === -1) {
    return undefined;
  }

  allMeetings[index] = {
    ...meetingData,
    id,
  };

  saveMeetings(allMeetings);

  return allMeetings[index];
}

// Delete a meeting.
export function deleteMeeting(id: number): boolean {
  const allMeetings = readMeetings();

  const updatedMeetings = allMeetings.filter(
    (meeting) => meeting.id !== id
  );

  if (updatedMeetings.length === allMeetings.length) {
    return false;
  }

  saveMeetings(updatedMeetings);

  return true;
}
