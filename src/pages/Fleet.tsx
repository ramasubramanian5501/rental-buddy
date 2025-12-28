import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Truck,
  User,
  Phone,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  useVehicles,
  useDrivers,
  useCreateVehicle,
  useCreateDriver,
  useDeleteVehicle,
  useDeleteDriver,
} from "@/hooks/useFleet";

const Fleet = () => {
  const [activeTab, setActiveTab] = useState<"vehicles" | "drivers">("vehicles");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: vehicles = [], isLoading: loadingVehicles } = useVehicles();
  const { data: drivers = [], isLoading: loadingDrivers } = useDrivers();
  const deleteVehicle = useDeleteVehicle();
  const deleteDriver = useDeleteDriver();

  const isLoading = loadingVehicles || loadingDrivers;

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vehicle_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery)
  );

  const handleDeleteVehicle = async (id: string) => {
    if (confirm("Delete this vehicle?")) await deleteVehicle.mutateAsync(id);
  };

  const handleDeleteDriver = async (id: string) => {
    if (confirm("Delete this driver?")) await deleteDriver.mutateAsync(id);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fleet Management</h1>
          <p className="text-muted-foreground mt-1">Manage vehicles and drivers</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold">{vehicles.length}</p>
          <p className="text-sm text-muted-foreground">Total Vehicles</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-success">
            {vehicles.filter((v) => v.status === "available").length}
          </p>
          <p className="text-sm text-muted-foreground">Available</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold">{drivers.length}</p>
          <p className="text-sm text-muted-foreground">Total Drivers</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-success">
            {drivers.filter((d) => d.status === "available").length}
          </p>
          <p className="text-sm text-muted-foreground">Available</p>
        </div>
      </motion.div>

      {/* Tabs & Search */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "vehicles"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Truck className="w-4 h-4" />
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab("drivers")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "drivers"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <User className="w-4 h-4" />
            Drivers
          </button>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {!isLoading && activeTab === "vehicles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-7 h-7 text-primary" />
                </div>
                <span className={`badge ${vehicle.status === "available" ? "badge-success" : vehicle.status === "on-duty" ? "badge-warning" : "badge-destructive"} capitalize`}>
                  {vehicle.status}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-1">{vehicle.vehicle_number}</h3>
              <p className="text-muted-foreground mb-4">{vehicle.vehicle_type}</p>
              <p className="text-sm mb-4">Capacity: {vehicle.capacity}</p>
              <button
                onClick={() => handleDeleteVehicle(vehicle.id)}
                className="w-full btn-secondary py-2 text-sm text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && activeTab === "drivers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <span className={`badge ${driver.status === "available" ? "badge-success" : "badge-warning"} capitalize`}>
                  {driver.status}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-1">{driver.name}</h3>
              <div className="flex items-center gap-2 text-sm mb-4">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{driver.phone}</span>
              </div>
              <button
                onClick={() => handleDeleteDriver(driver.id)}
                className="w-full btn-secondary py-2 text-sm text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Fleet;
