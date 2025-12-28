import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { Product, ProductFormData } from "@/types/database";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const categories = [
  "Excavators",
  "Cranes",
  "Mixers",
  "Lifts",
  "Compactors",
  "Scaffolding",
  "Generators",
  "Other",
];

const sizeUnits = ["meters", "centimeters", "feet", "liters", "tons", "kg"];

export function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    category: product?.category || "Other",
    size_value: product?.size_value || "",
    size_unit: product?.size_unit || "meters",
    rent_per_hour: product?.rent_per_hour || 0,
    description: product?.description || "",
    stock_count: product?.stock_count || 1,
    available_count: product?.available_count || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (product) {
      await updateProduct.mutateAsync({ id: product.id, ...formData });
    } else {
      await createProduct.mutateAsync(formData);
    }
    onClose();
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

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
                {product ? "Edit Product" : "Add New Product"}
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="e.g., JCB Excavator 3DX"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="input-field"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rent per Hour (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.rent_per_hour}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rent_per_hour: Number(e.target.value),
                      })
                    }
                    className="input-field"
                    placeholder="1500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Size Value *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.size_value}
                    onChange={(e) =>
                      setFormData({ ...formData, size_value: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g., 3.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Size Unit
                  </label>
                  <select
                    value={formData.size_unit}
                    onChange={(e) =>
                      setFormData({ ...formData, size_unit: e.target.value })
                    }
                    className="input-field"
                  >
                    {sizeUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Stock
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.stock_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_count: Number(e.target.value),
                      })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Available Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={formData.stock_count}
                    value={formData.available_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_count: Number(e.target.value),
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-field min-h-[80px]"
                  placeholder="Brief description of the equipment..."
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
                  {isLoading ? "Saving..." : product ? "Update" : "Add Product"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
