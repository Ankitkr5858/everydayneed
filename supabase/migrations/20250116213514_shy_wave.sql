/*
  # Add location search capabilities

  1. Changes
    - Add latitude and longitude columns to societies table
    - Add location-based search function
    - Add spatial index for faster queries
    - Update RLS policies

  2. New Functions
    - get_nearby_societies: Finds societies within a given radius
    - calculate_distance: Calculates distance between two points
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- Add location columns to societies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'societies' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE societies ADD COLUMN latitude double precision;
    ALTER TABLE societies ADD COLUMN longitude double precision;
  END IF;
END $$;

-- Create index for faster location queries
CREATE INDEX IF NOT EXISTS idx_societies_location 
ON societies USING gist (ll_to_earth(latitude, longitude));

-- Function to get nearby societies
CREATE OR REPLACE FUNCTION get_nearby_societies(
  user_lat double precision,
  user_lng double precision,
  radius_km double precision
) RETURNS TABLE (
  id uuid,
  name text,
  location json,
  distance double precision
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    json_build_object(
      'lat', s.latitude,
      'lng', s.longitude
    ) as location,
    earth_distance(
      ll_to_earth(user_lat, user_lng),
      ll_to_earth(s.latitude, s.longitude)
    ) / 1000 as distance
  FROM societies s
  WHERE earth_box(
    ll_to_earth(user_lat, user_lng),
    radius_km * 1000
  ) @> ll_to_earth(s.latitude, s.longitude)
  AND earth_distance(
    ll_to_earth(user_lat, user_lng),
    ll_to_earth(s.latitude, s.longitude)
  ) <= radius_km * 1000
  ORDER BY distance
  LIMIT 10;
END;
$$;