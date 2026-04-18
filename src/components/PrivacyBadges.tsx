import { motion } from "framer-motion";
import { Shield, FileX, Database, Lock } from "lucide-react";

const badges = [
  { icon: Shield, label: "HIPAA-Aligned Privacy", desc: "Your data is handled with care" },
  { icon: FileX, label: "Files Not Stored", desc: "Deleted after processing" },
  { icon: Database, label: "De-identified Results", desc: "No personal info saved" },
  { icon: Lock, label: "Encrypted Transfer", desc: "Secure TLS/HTTPS" },
];

const PrivacyBadges = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="panel-card p-6"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Your Privacy & Security</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {badges.map(({ icon: Icon, label, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.2 } }}
            className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-secondary/50 border border-transparent hover:border-primary/20 transition-all cursor-default"
          >
            <motion.div
              className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
              whileHover={{ rotate: 10 }}
            >
              <Icon className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-xs font-semibold text-foreground">{label}</span>
            <span className="text-[10px] text-muted-foreground">{desc}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PrivacyBadges;
