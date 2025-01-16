/*
  # Add phone column to profiles table

  1. Changes
    - Add phone column to profiles table
    - Add phone number validation check
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
    ALTER TABLE profiles ADD CONSTRAINT phone_format CHECK (phone ~ '^\+[1-9]\d{1,14}$');
  END IF;
END $$;