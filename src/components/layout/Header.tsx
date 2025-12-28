import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bell, Plus, User } from "lucide-react";

interface HeaderProps {
  sidebarWidth: number;
}

export function Header({ sidebarWidth }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <motion.header
      initial={false}
      animate={{ marginLeft: sidebarWidth }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 right-0 z-30 bg-background/95 backdrop-blur-lg border-b border-border"
      style={{ left: sidebarWidth }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <motion.div
            animate={{
              boxShadow: searchFocused
                ? "0 0 0 2px hsl(38 92% 50% / 0.3)"
                : "none",
            }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customers, rentals, products, vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="input-field pl-12 py-2.5"
            />
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-6">
          <button className="btn-accent">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Rental</span>
          </button>

          <button className="relative p-2.5 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>

          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
