import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Rental, RentalFormData, RentalWithDetails } from "@/types/database";
import { toast } from "sonner";

export function useRentals() {
  return useQuery({
    queryKey: ["rentals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rentals")
        .select(`
          *,
          customer:customers(*),
          vehicle:vehicles(*),
          driver:drivers(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch products for each rental
      const rentalsWithProducts = await Promise.all(
        (data || []).map(async (rental) => {
          const { data: rentalProducts } = await supabase
            .from("rental_products")
            .select("product_id, products(*)")
            .eq("rental_id", rental.id);

          return {
            ...rental,
            products: rentalProducts?.map((rp: any) => rp.products) || [],
          };
        })
      );

      return rentalsWithProducts as RentalWithDetails[];
    },
  });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: ["rentals", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rentals")
        .select(`
          *,
          customer:customers(*),
          vehicle:vehicles(*),
          driver:drivers(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const { data: rentalProducts } = await supabase
          .from("rental_products")
          .select("product_id, products(*)")
          .eq("rental_id", data.id);

        return {
          ...data,
          products: rentalProducts?.map((rp: any) => rp.products) || [],
        } as RentalWithDetails;
      }

      return null;
    },
    enabled: !!id,
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      rental,
      productIds,
    }: {
      rental: {
        customer_id: string;
        location?: string | null;
        location_lat?: number | null;
        location_lng?: number | null;
        start_date: string;
        return_date: string;
        status?: string;
        advance_percent?: number;
        advance_amount?: number;
        total_amount?: number;
        remaining_amount?: number;
        vehicle_id?: string | null;
        driver_id?: string | null;
      };
      productIds: string[];
    }) => {
      // Create rental
      const { data: rentalData, error: rentalError } = await supabase
        .from("rentals")
        .insert([rental])
        .select()
        .single();

      if (rentalError) throw rentalError;

      // Add products to rental
      if (productIds.length > 0) {
        const rentalProducts = productIds.map((productId) => ({
          rental_id: rentalData.id,
          product_id: productId,
        }));

        const { error: productsError } = await supabase
          .from("rental_products")
          .insert(rentalProducts);

        if (productsError) throw productsError;
      }

      return rentalData as Rental;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Rental created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create rental: " + error.message);
    },
  });
}

export function useUpdateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...rental }: Partial<Rental> & { id: string }) => {
      const { data, error } = await supabase
        .from("rentals")
        .update(rental)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Rental;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      toast.success("Rental updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update rental: " + error.message);
    },
  });
}

export function useDeleteRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rentals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      toast.success("Rental deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete rental: " + error.message);
    },
  });
}
