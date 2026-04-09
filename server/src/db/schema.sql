-- Enum for the listing type so we don't end up with random strings in the db
CREATE TYPE listing_type AS ENUM ('rent', 'buy', 'exchange', 'donation');

-- Main ads table
CREATE TABLE ads (
  id    SERIAL PRIMARY KEY,
  title VARCHAR(155) NOT NULL,
  type  listing_type NOT NULL,

  -- Storing them here to avoid extra API calls when we need to display the area
  area_place_id       VARCHAR(255) NOT NULL,
  area_main_text      VARCHAR(255) NOT NULL,
  area_secondary_text VARCHAR(255) NOT NULL,

  price       NUMERIC(12, 2) NOT NULL,
  description TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);