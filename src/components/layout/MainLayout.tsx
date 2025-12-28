import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(280);

  useEffect(() => {
    const handleResize = () => {
      // Update sidebar width based on its actual width
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth);
      }
    };

    const observer = new ResizeObserver(handleResize);
    const sidebar = document.querySelector("aside");
    if (sidebar) {
      observer.observe(sidebar);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header sidebarWidth={sidebarWidth} />
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="pt-20 min-h-screen"
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
