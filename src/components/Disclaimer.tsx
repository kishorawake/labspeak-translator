import { motion } from "framer-motion";
import { Info } from "lucide-react";

const Disclaimer = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    className="bg-status-attention/10 border border-status-attention/20 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm"
  >
    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}>
      <Info className="w-5 h-5 text-status-attention flex-shrink-0 mt-0.5" />
    </motion.div>
    <div>
      <h4 className="text-sm font-semibold text-foreground">Disclaimer</h4>
      <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
        This is AI-generated information. Always consult your doctor for medical advice.
        This information is for educational purposes only and is not a substitute for
        professional medical advice, diagnosis, or treatment.
      </p>
    </div>
  </motion.div>
);

export default Disclaimer;
