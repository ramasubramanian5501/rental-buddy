import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { useCreateRental } from "@/hooks/useRentals";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useVehicles, useDrivers } from "@/hooks/useFleet";

interface RentalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RentalFormModal({ isOpen, onClose }: RentalFormModalProps) {
  const createRental = useCreateRental();
  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts();
  const { data: vehicles = [] } = useVehicles();
  const { data: drivers = [] } = useDrivers();

  const [formData, setFormData] = useState({
    customer_id: "",
    location: "",
    start_date: "",
    return_date: "",
    advance_percent: 10,
    vehicle_id: "",
    driver_id: "",
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total based on selected products and duration
  useEffect(() => {
    if (formData.start_date && formData.return_date && selectedProducts.length > 0) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.return_date);
      const hours = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60)));

      const total = selectedProducts.reduce((sum, productId) => {
        const product = products.find((p) => p.id === productId);
        return sum + (product?.rent_per_hour || 0) * hours;
      }, 0);

      setTotalAmount(total);
    }
  }, [formData.start_date, formData.return_date, selectedProducts, products]);

  const advanceAmount = Math.round((totalAmount * formData.advance_percent) / 100);
  const remainingAmount = totalAmount - advanceAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    await createRental.mutateAsync({
      rental: {
        customer_id: formData.customer_id,
        location: formData.location || null,
        start_date: new Date(formData.start_date).toISOString(),
        return_date: new Date(formData.return_date).toISOString(),
        advance_percent: formData.advance_percent,
        advance_amount: advanceAmount,
        total_amount: totalAmount,
        remaining_amount: remainingAmount,
        vehicle_id: formData.vehicle_id || null,
        driver_id: formData.driver_id || null,
        status: "pending",
      },
      productIds: selectedProducts,
    });

    onClose();
    // Reset form
    setFormData({
      customer_id: "",
      location: "",
      start_date: "",
      return_date: "",
      advance_percent: 10,
      vehicle_id: "",
      driver_id: "",
    });
    setSelectedProducts([]);
  };

  const availableProducts = products.filter((p) => p.available_count > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">Create New Rental</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer *
                </label>
                <select
                  required
                  value={formData.customer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_id: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.company}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Equipment *
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                  {availableProducts.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(
                              selectedProducts.filter((id) => id !== product.id)
                            );
                          }
                        }}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="flex-1">{product.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ₹{product.rent_per_hour}/hr
                      </span>
                      <span className="text-xs badge badge-success">
                        {product.available_count} available
                      </span>
                    </label>
                  ))}
                  {availableProducts.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No products available
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Return Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.return_date}
                    onChange={(e) =>
                      setFormData({ ...formData, return_date: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Work Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="input-field"
                  placeholder="e.g., Andheri East, Mumbai"
                />
              </div>

              {/* Vehicle & Driver */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Vehicle
                  </label>
                  <select
                    value={formData.vehicle_id}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle_id: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Select vehicle</option>
                    {vehicles
                      .filter((v) => v.status === "available")
                      .map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicle_number} - {vehicle.vehicle_type}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Driver
                  </label>
                  <select
                    value={formData.driver_id}
                    onChange={(e) =>
                      setFormData({ ...formData, driver_id: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Select driver</option>
                    {drivers
                      .filter((d) => d.status === "available")
                      .map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} - {driver.phone}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Payment */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Advance Percentage
                </label>
                <div className="flex gap-2">
                  {[10, 20, 30, 50].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, advance_percent: percent })
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.advance_percent === percent
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {totalAmount > 0 && (
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Advance ({formData.advance_percent}%)
                    </span>
                    <span className="font-medium text-success">
                      ₹{advanceAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-bold text-accent">
                      ₹{remainingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRental.isPending}
                  className="flex-1 btn-accent"
                >
                  {createRental.isPending ? "Creating..." : "Create Rental"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
