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
  MoreVertical,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

interface Vehicle {
  id: string;
  number: string;
  type: string;
  capacity: string;
  status: "available" | "on-duty" | "maintenance";
  assignedDriver?: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  status: "available" | "on-duty";
  assignedVehicle?: string;
}

const sampleVehicles: Vehicle[] = [
  {
    id: "VEH-001",
    number: "MH-01-AB-1234",
    type: "Flatbed Truck",
    capacity: "10 Tons",
    status: "on-duty",
    assignedDriver: "Suresh Patil",
  },
  {
    id: "VEH-002",
    number: "MH-01-CD-5678",
    type: "Crane Truck",
    capacity: "15 Tons",
    status: "on-duty",
    assignedDriver: "Amit Deshmukh",
  },
  {
    id: "VEH-003",
    number: "MH-04-EF-9012",
    type: "Flatbed Truck",
    capacity: "8 Tons",
    status: "available",
  },
  {
    id: "VEH-004",
    number: "MH-01-GH-3456",
    type: "Heavy Loader",
    capacity: "20 Tons",
    status: "maintenance",
  },
];

const sampleDrivers: Driver[] = [
  {
    id: "DRV-001",
    name: "Suresh Patil",
    phone: "+91 98765 11111",
    license: "MH-1234567890",
    status: "on-duty",
    assignedVehicle: "MH-01-AB-1234",
  },
  {
    id: "DRV-002",
    name: "Amit Deshmukh",
    phone: "+91 98765 22222",
    license: "MH-2345678901",
    status: "on-duty",
    assignedVehicle: "MH-01-CD-5678",
  },
  {
    id: "DRV-003",
    name: "Rahul Jadhav",
    phone: "+91 98765 33333",
    license: "MH-3456789012",
    status: "available",
  },
  {
    id: "DRV-004",
    name: "Vijay Shinde",
    phone: "+91 98765 44444",
    license: "MH-4567890123",
    status: "available",
  },
];

const vehicleStatusStyles = {
  available: "badge-success",
  "on-duty": "badge-warning",
  maintenance: "badge-destructive",
};

const driverStatusStyles = {
  available: "badge-success",
  "on-duty": "badge-warning",
};

const Fleet = () => {
  const [activeTab, setActiveTab] = useState<"vehicles" | "drivers">("vehicles");
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles] = useState<Vehicle[]>(sampleVehicles);
  const [drivers] = useState<Driver[]>(sampleDrivers);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery)
  );

  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fleet Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage vehicles and drivers for deliveries
          </p>
        </div>
        <button className="btn-accent">
          <Plus className="w-4 h-4" />
          {activeTab === "vehicles" ? "Add Vehicle" : "Add Driver"}
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{vehicles.length}</p>
          <p className="text-sm text-muted-foreground">Total Vehicles</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-success">
            {vehicles.filter((v) => v.status === "available").length}
          </p>
          <p className="text-sm text-muted-foreground">Available</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{drivers.length}</p>
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex flex-col lg:flex-row gap-4"
      >
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "vehicles"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
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
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <User className="w-4 h-4" />
            Drivers
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              activeTab === "vehicles"
                ? "Search by vehicle number..."
                : "Search by driver name..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </motion.div>

      {/* Vehicles Grid */}
      {activeTab === "vehicles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-card rounded-xl border border-border p-6 hover:border-accent/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-7 h-7 text-primary" />
                </div>
                <span
                  className={`badge ${vehicleStatusStyles[vehicle.status]} capitalize`}
                >
                  {vehicle.status}
                </span>
              </div>

              <h3 className="font-bold text-xl mb-1">{vehicle.number}</h3>
              <p className="text-muted-foreground mb-4">{vehicle.type}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{vehicle.capacity}</span>
                </div>
                {vehicle.assignedDriver && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Driver</span>
                    <span className="font-medium">{vehicle.assignedDriver}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button className="flex-1 btn-secondary py-2 text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Drivers Grid */}
      {activeTab === "drivers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDrivers.map((driver, index) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-card rounded-xl border border-border p-6 hover:border-accent/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <span
                  className={`badge ${driverStatusStyles[driver.status]} capitalize`}
                >
                  {driver.status}
                </span>
              </div>

              <h3 className="font-bold text-xl mb-1">{driver.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{driver.id}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">License</span>
                  <span className="font-medium">{driver.license}</span>
                </div>
                {driver.assignedVehicle && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="font-medium text-accent">
                      {driver.assignedVehicle}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button className="flex-1 btn-secondary py-2 text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Fleet;
