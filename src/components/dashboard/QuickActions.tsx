import { motion } from "framer-motion";
import { Plus, FileText, Package, Users, Truck, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: Plus,
    label: "New Rental",
    description: "Create a rental order",
    path: "/rentals/new",
    primary: true,
  },
  {
    icon: Package,
    label: "Add Product",
    description: "Add equipment",
    path: "/products/new",
  },
  {
    icon: Users,
    label: "Add Customer",
    description: "Register customer",
    path: "/customers/new",
  },
  {
    icon: Truck,
    label: "Add Vehicle",
    description: "Register vehicle",
    path: "/fleet/new",
  },
  {
    icon: Receipt,
    label: "Generate Bill",
    description: "Create invoice",
    path: "/billing/new",
  },
  {
    icon: FileText,
    label: "View Reports",
    description: "Analytics",
    path: "/analytics",
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card rounded-xl border border-border p-6"
    >
      <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={action.label}
            to={action.path}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
              action.primary
                ? "gradient-accent text-accent-foreground border-transparent"
                : "bg-muted/50 border-border hover:border-accent/30"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                action.primary
                  ? "bg-accent-foreground/10"
                  : "bg-background"
              }`}
            >
              <action.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">{action.label}</p>
              <p
                className={`text-xs ${
                  action.primary
                    ? "text-accent-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
