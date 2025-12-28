import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomers";
import { Customer, CustomerFormData } from "@/types/database";

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export function CustomerFormModal({ isOpen, onClose, customer }: CustomerFormModalProps) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    aadhaar_number: customer?.aadhaar_number || "",
    pan_number: customer?.pan_number || "",
    company: customer?.company || "",
    address: customer?.address || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (customer) {
      await updateCustomer.mutateAsync({ id: customer.id, ...formData });
    } else {
      await createCustomer.mutateAsync(formData);
    }
    onClose();
  };

  const isLoading = createCustomer.isPending || updateCustomer.isPending;

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
            className="bg-card rounded-xl border border-border shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">
                {customer ? "Edit Customer" : "Add New Customer"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="input-field"
                  placeholder="Construction company name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field"
                    placeholder="email@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={formData.aadhaar_number || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, aadhaar_number: e.target.value })
                    }
                    className="input-field"
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={formData.pan_number || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, pan_number: e.target.value })
                    }
                    className="input-field"
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="input-field min-h-[80px]"
                  placeholder="Full address"
                />
              </div>

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
                  disabled={isLoading}
                  className="flex-1 btn-accent"
                >
                  {isLoading ? "Saving..." : customer ? "Update" : "Add Customer"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
