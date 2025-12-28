-- Create storage bucket for rental documents and photos
INSERT INTO storage.buckets (id, name, public) VALUES ('rental-documents', 'rental-documents', true);

-- Storage policies for rental documents
CREATE POLICY "Anyone can view rental documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'rental-documents');

CREATE POLICY "Anyone can upload rental documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'rental-documents');

CREATE POLICY "Anyone can update rental documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'rental-documents');

CREATE POLICY "Anyone can delete rental documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'rental-documents');

-- Add new columns to rentals table
ALTER TABLE public.rentals 
ADD COLUMN IF NOT EXISTS driver_name TEXT,
ADD COLUMN IF NOT EXISTS driver_phone TEXT,
ADD COLUMN IF NOT EXISTS load_photo_url TEXT,
ADD COLUMN IF NOT EXISTS document_urls TEXT[] DEFAULT '{}';

-- Create rental_product_items table for detailed product selection with quantities
CREATE TABLE IF NOT EXISTS public.rental_product_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rental_product_items ENABLE ROW LEVEL SECURITY;

-- RLS policy for rental_product_items
CREATE POLICY "Allow all operations on rental_product_items"
ON public.rental_product_items
FOR ALL
USING (true)
WITH CHECK (true);