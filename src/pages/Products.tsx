import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Package,
  Eye,
  Loader2,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductFormModal } from "@/components/modals/ProductFormModal";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Product } from "@/types/database";

const categories = [
  "All",
  "Excavators",
  "Cranes",
  "Mixers",
  "Lifts",
  "Compactors",
  "Scaffolding",
  "Generators",
  "Other",
];

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your equipment inventory
          </p>
        </div>
        <button className="btn-accent" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col lg:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-card rounded-xl border border-border overflow-hidden hover:border-accent/30 hover:shadow-md transition-all group"
            >
              {/* Product Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <Package className="w-16 h-16 text-muted-foreground/30" />
              </div>

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-medium text-accent">
                      {product.id.slice(0, 8)}
                    </span>
                    <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                  </div>
                </div>

                {/* Category & Size */}
                <div className="flex gap-2 mb-4">
                  <span className="badge badge-primary">{product.category}</span>
                  <span className="badge bg-muted text-muted-foreground">
                    {product.size_value} {product.size_unit}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description || "No description available"}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-border">
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">
                      ₹{Number(product.rent_per_hour).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">per hour</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">
                      {product.available_count}/{product.stock_count}
                    </p>
                    <p className="text-xs text-muted-foreground">available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">
                      {product.rent_count}
                    </p>
                    <p className="text-xs text-muted-foreground">total rents</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 btn-secondary py-2.5 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            {products.length === 0
              ? "Get started by adding your first product"
              : "Try adjusting your search or filter criteria"}
          </p>
          <button className="btn-accent" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </motion.div>
      )}

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
      />
    </MainLayout>
  );
};

export default Products;
