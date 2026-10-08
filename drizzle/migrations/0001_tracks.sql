CREATE TABLE public.tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text,
  file_path text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tracks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracks TO authenticated;
GRANT ALL ON public.tracks TO service_role;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read tracks" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Admins can insert tracks" ON public.tracks FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tracks" ON public.tracks FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tracks" ON public.tracks FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins upload tracks" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tracks' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update track files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'tracks' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete track files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tracks' AND private.has_role(auth.uid(), 'admin'));