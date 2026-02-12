-- Create cv-documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-documents', 'cv-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload their own CVs
CREATE POLICY "Users can upload their own CVs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cv-documents'
);

-- Policy: Public read access for CVs
CREATE POLICY "Public can read CVs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'cv-documents');

-- Policy: Users can delete their own CVs
CREATE POLICY "Users can delete their own CVs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'cv-documents'
);

-- Policy: Users can update their own CVs
CREATE POLICY "Users can update their own CVs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'cv-documents')
WITH CHECK (bucket_id = 'cv-documents');
