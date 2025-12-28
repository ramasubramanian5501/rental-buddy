export interface Product {
  id: string;
  name: string;
  category: string;
  size_value: string;
  size_unit: string;
  rent_per_hour: number;
  description: string | null;
  stock_count: number;
  available_count: number;
  rent_count: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  aadhaar_number: string | null;
  pan_number: string | null;
  company: string;
  address: string | null;
  total_rentals: number;
  active_rentals: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  vehicle_number: string;
  vehicle_type: string;
  capacity: string;
  status: "available" | "on-duty" | "maintenance";
  assigned_driver_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  license_number: string | null;
  status: "available" | "on-duty";
  assigned_vehicle_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: string;
  rental_code: string;
  customer_id: string;
  location: string | null;
  location_lat: number | null;
  location_lng: number | null;
  start_date: string;
  return_date: string;
  actual_return_date: string | null;
  status: "pending" | "active" | "overdue" | "completed";
  advance_percent: number;
  advance_amount: number;
  total_amount: number;
  remaining_amount: number;
  vehicle_id: string | null;
  driver_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface RentalProduct {
  id: string;
  rental_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface RentalWithDetails extends Rental {
  customer?: Customer;
  vehicle?: Vehicle;
  driver?: Driver;
  products?: Product[];
}

export type ProductFormData = Omit<Product, "id" | "created_at" | "updated_at" | "rent_count">;
export type CustomerFormData = Omit<Customer, "id" | "created_at" | "updated_at" | "total_rentals" | "active_rentals" | "total_spent">;
export type VehicleFormData = Omit<Vehicle, "id" | "created_at" | "updated_at">;
export type DriverFormData = Omit<Driver, "id" | "created_at" | "updated_at">;
export type RentalFormData = Omit<Rental, "id" | "rental_code" | "created_at" | "updated_at">;
