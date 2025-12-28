import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Construction } from "lucide-react";

const Billing = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Generate invoices and manage payments
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-12 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <Construction className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The billing module is under development. Soon you'll be able to
          generate invoices, track payments, and send bills via Email/WhatsApp.
        </p>
      </motion.div>
    </MainLayout>
  );
};

export default Billing;
