import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../ui/Card";

export default function GrowthChart({ data }) {
  return (
    <Card className="h-[340px]">
      <p className="mb-5 font-display text-[1.25rem] font-bold tracking-[-0.03em]">Growth Overview</p>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
            <linearGradient id="violet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0)" />
            </linearGradient>
            <linearGradient id="cyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.25)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="month" stroke="#4B4B6B" tick={{ fill: "#4B4B6B", fontFamily: "JetBrains Mono", fontSize: 11 }} />
          <YAxis stroke="#4B4B6B" tick={{ fill: "#4B4B6B", fontFamily: "JetBrains Mono", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#10101F",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "10px",
              fontFamily: "Cabinet Grotesk",
              fontSize: "13px",
              color: "#F0F0FF",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
            labelStyle={{ color: "#8B8BA8", fontFamily: "JetBrains Mono", fontSize: "11px" }}
            cursor={{ stroke: "rgba(99,102,241,0.2)", strokeWidth: 1 }}
          />
          <Area type="monotone" dataKey="instagram" stroke="#3B82F6" fill="url(#blue)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="facebook" stroke="#8B5CF6" fill="url(#violet)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="youtube" stroke="#22D3EE" fill="url(#cyan)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
