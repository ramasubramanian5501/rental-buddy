-- Make rental_code have a default temporary value that will be replaced by trigger
ALTER TABLE public.rentals ALTER COLUMN rental_code SET DEFAULT 'TEMP';