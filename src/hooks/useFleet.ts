import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Vehicle, Driver, VehicleFormData, DriverFormData } from "@/types/database";
import { toast } from "sonner";

// Vehicles
export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*, driver:drivers(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (Vehicle & { driver: Driver | null })[];
    },
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: VehicleFormData) => {
      const { data, error } = await supabase
        .from("vehicles")
        .insert(vehicle)
        .select()
        .single();

      if (error) throw error;
      return data as Vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add vehicle: " + error.message);
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...vehicle }: Partial<Vehicle> & { id: string }) => {
      const { data, error } = await supabase
        .from("vehicles")
        .update(vehicle)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update vehicle: " + error.message);
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete vehicle: " + error.message);
    },
  });
}

// Drivers
export function useDrivers() {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*, vehicle:vehicles(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (Driver & { vehicle: Vehicle | null })[];
    },
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (driver: DriverFormData) => {
      const { data, error } = await supabase
        .from("drivers")
        .insert(driver)
        .select()
        .single();

      if (error) throw error;
      return data as Driver;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add driver: " + error.message);
    },
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...driver }: Partial<Driver> & { id: string }) => {
      const { data, error } = await supabase
        .from("drivers")
        .update(driver)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Driver;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update driver: " + error.message);
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("drivers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete driver: " + error.message);
    },
  });
}
