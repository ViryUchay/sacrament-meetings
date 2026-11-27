
-- WDD430 W03: Sacrament Meetings Database Migration

-- Preserve the original table:
-- ALTER TABLE meetings RENAME TO meetings_legacy;

-- Create the new meetings table.
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    meeting_type VARCHAR(20) NOT NULL
        CHECK (meeting_type IN (
            'testimony', 'regular', 'stake', 'general', 'special'
        )),
    presiding VARCHAR(255) NOT NULL,
    conducting VARCHAR(255) NOT NULL,
    announcements TEXT[] DEFAULT '{}',
    opening_hymn JSONB NOT NULL,
    opening_prayer VARCHAR(255) NOT NULL,
    ward_business JSONB DEFAULT '[]',
    stake_business BOOLEAN DEFAULT false,
    sacrament_hymn JSONB NOT NULL,
    speakers JSONB DEFAULT '[]',
    closing_hymn JSONB NOT NULL,
    closing_prayer VARCHAR(255) NOT NULL
);

-- Migrate the six original records.
-- Run only if the new table has not already been populated.
INSERT INTO meetings (
    id, date, meeting_type, presiding, conducting,
    announcements, opening_hymn, opening_prayer,
    ward_business, stake_business, sacrament_hymn,
    speakers, closing_hymn, closing_prayer
)
SELECT
    id,
    meeting_date,
    meeting_data->>'meetingType',
    meeting_data->>'presiding',
    meeting_data->>'conducting',
    ARRAY(
        SELECT jsonb_array_elements_text(
            COALESCE(meeting_data->'announcements', '[]'::jsonb)
        )
    ),
    meeting_data->'openingHymn',
    meeting_data->>'openingPrayer',
    COALESCE(meeting_data->'wardBusiness', '[]'::jsonb),
    COALESCE((meeting_data->>'stakeBusiness')::boolean, false),
    meeting_data->'sacramentHymn',
    COALESCE(meeting_data->'speakers', '[]'::jsonb),
    meeting_data->'closingHymn',
    meeting_data->>'closingPrayer'
FROM meetings_legacy;

-- Synchronize the automatic ID generator after manual ID migration.
SELECT setval(
    pg_get_serial_sequence('meetings', 'id'),
    (SELECT MAX(id) FROM meetings)
);
