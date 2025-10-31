-- Create study_materials table
CREATE TABLE public.study_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  original_url TEXT,
  file_path TEXT,
  notes TEXT,
  flashcards JSONB DEFAULT '[]'::jsonb,
  quiz_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for MVP)
CREATE POLICY "Anyone can view study materials" 
ON public.study_materials 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create study materials" 
ON public.study_materials 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update study materials" 
ON public.study_materials 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete study materials" 
ON public.study_materials 
FOR DELETE 
USING (true);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('study-files', 'study-files', true);

-- Create storage policies
CREATE POLICY "Anyone can view study files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'study-files');

CREATE POLICY "Anyone can upload study files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'study-files');

CREATE POLICY "Anyone can update study files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'study-files');

CREATE POLICY "Anyone can delete study files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'study-files');