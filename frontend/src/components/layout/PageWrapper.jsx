import { motion } from "framer-motion";
import Sidebar from "./Sidebar";

export default function PageWrapper({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="app-main"
      >
        {children}
      </motion.main>
    </div>
  );
}
