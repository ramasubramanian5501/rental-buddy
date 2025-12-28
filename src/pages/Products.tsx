import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Package,
  Eye,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  sizeUnit: string;
  rentPerHour: number;
  stock: number;
  available: number;
  rentCount: number;
  description: string;
  image?: string;
}

const sampleProducts: Product[] = [
  {
    id: "PRD-001",
    name: "JCB Excavator 3DX",
    category: "Excavators",
    size: "3.5",
    sizeUnit: "meters",
    rentPerHour: 1500,
    stock: 5,
    available: 3,
    rentCount: 124,
    description: "Heavy-duty excavator for large construction sites",
  },
  {
    id: "PRD-002",
    name: "Tower Crane TC-500",
    category: "Cranes",
    size: "50",
    sizeUnit: "meters",
    rentPerHour: 8500,
    stock: 2,
    available: 1,
    rentCount: 45,
    description: "High-capacity tower crane for multi-story projects",
  },
  {
    id: "PRD-003",
    name: "Concrete Mixer CM-100",
    category: "Mixers",
    size: "100",
    sizeUnit: "liters",
    rentPerHour: 250,
    stock: 12,
    available: 8,
    rentCount: 289,
    description: "Portable concrete mixer for small to medium jobs",
  },
  {
    id: "PRD-004",
    name: "Boom Lift 60ft",
    category: "Lifts",
    size: "60",
    sizeUnit: "feet",
    rentPerHour: 1200,
    stock: 4,
    available: 2,
    rentCount: 78,
    description: "Telescopic boom lift for elevated work",
  },
  {
    id: "PRD-005",
    name: "Compactor Roller CR-200",
    category: "Compactors",
    size: "2",
    sizeUnit: "tons",
    rentPerHour: 800,
    stock: 6,
    available: 5,
    rentCount: 156,
    description: "Vibratory roller for road and soil compaction",
  },
  {
    id: "PRD-006",
    name: "Scaffolding Set 20m",
    category: "Scaffolding",
    size: "20",
    sizeUnit: "meters",
    rentPerHour: 150,
    stock: 25,
    available: 18,
    rentCount: 412,
    description: "Complete scaffolding set with safety rails",
  },
];

const categories = [
  "All",
  "Excavators",
  "Cranes",
  "Mixers",
  "Lifts",
  "Compactors",
  "Scaffolding",
];

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products] = useState<Product[]>(sampleProducts);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <button className="btn-accent">
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

      {/* Products Grid */}
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
                    {product.id}
                  </span>
                  <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Category & Size */}
              <div className="flex gap-2 mb-4">
                <span className="badge badge-primary">{product.category}</span>
                <span className="badge bg-muted text-muted-foreground">
                  {product.size} {product.sizeUnit}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-border">
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">
                    ₹{product.rentPerHour.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per hour</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">
                    {product.available}/{product.stock}
                  </p>
                  <p className="text-xs text-muted-foreground">available</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">
                    {product.rentCount}
                  </p>
                  <p className="text-xs text-muted-foreground">total rents</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 btn-secondary py-2.5 text-sm">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex-1 btn-secondary py-2.5 text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-2.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button className="btn-accent">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Products;
