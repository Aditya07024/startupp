import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../ui/Card";

export default function BarMetricsChart({ title = "Performance Snapshot", data = [], dataKey = "value", xKey = "label", height = 320 }) {
  return (
    <Card className="p-5">
      <p className="mb-5 font-display text-[1.25rem] font-bold tracking-[-0.03em]">{title}</p>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={18}>
            <defs>
              <linearGradient id="barPinkBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="55%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey={xKey} stroke="#4B4B6B" tick={{ fill: "#8B8BA8", fontFamily: "JetBrains Mono", fontSize: 11 }} />
            <YAxis stroke="#4B4B6B" tick={{ fill: "#8B8BA8", fontFamily: "JetBrains Mono", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "#10101F",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "10px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "#F0F0FF",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
              labelStyle={{ color: "#8B8BA8", fontFamily: "JetBrains Mono", fontSize: "11px" }}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey={dataKey} fill="url(#barPinkBlue)" radius={[10, 10, 2, 2]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
