import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

const Settings = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your application preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {[
          {
            icon: User,
            title: "Account",
            description: "Manage your admin profile and credentials",
          },
          {
            icon: Bell,
            title: "Notifications",
            description: "Configure email and WhatsApp notifications",
          },
          {
            icon: Shield,
            title: "Security",
            description: "Password and authentication settings",
          },
          {
            icon: Palette,
            title: "Appearance",
            description: "Theme and display preferences",
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-card rounded-xl border border-border p-6 hover:border-accent/30 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <item.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Settings;
