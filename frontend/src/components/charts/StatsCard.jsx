import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const numeric = Number(String(value).replace(/[^0-9.-]/g, ""));
  const isNumeric = Number.isFinite(numeric) && String(value) !== "--";
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isNumeric) {
      motionValue.set(numeric);
    }
  }, [isNumeric, motionValue, numeric]);

  useEffect(() => spring.on("change", (latest) => setDisplay(Math.round(latest))), [spring]);

  if (!isNumeric) {
    return <span>{value}</span>;
  }

  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

export default function StatsCard({ label, value, change, accent = "blue" }) {
  const tone = change !== undefined && change < 0 ? "down" : "up";
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="stat-card">
      <p className="stat-label">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="stat-value"><AnimatedNumber value={value} /></p>
        {change !== undefined && <p className={`stat-change ${tone}`}>{change > 0 ? "+" : ""}{change}%</p>}
      </div>
    </motion.div>
  );
}
