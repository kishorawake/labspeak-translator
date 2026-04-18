import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";
import type { PanelSummary } from "@/services/labAnalyzer";

interface MiniChartProps {
  panel: PanelSummary;
}

const statusColor = (status: string) => {
  if (status === "normal") return "hsl(152, 69%, 40%)";
  if (status.includes("critical")) return "hsl(0, 72%, 51%)";
  return "hsl(38, 92%, 50%)";
};

const SparklineChart = ({ panel }: MiniChartProps) => {
  const data = panel.tests.map((t) => ({
    name: t.name.slice(0, 6),
    value: t.value,
    color: statusColor(t.status),
  }));

  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${panel.name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            background: "hsl(220, 20%, 10%)",
            border: "1px solid hsl(220, 15%, 20%)",
            borderRadius: "8px",
            fontSize: "10px",
            color: "#fff",
          }}
          formatter={(value: any) => [value, ""]} // eslint-disable-line @typescript-eslint/no-explicit-any
          labelFormatter={() => ""}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(199, 89%, 48%)"
          strokeWidth={2}
          fill={`url(#grad-${panel.name})`}
          animationDuration={1500}
          animationEasing="ease-out"
          dot={(props: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            const { cx, cy, index } = props;
            const d = data[index];
            return (
              <circle
                key={index}
                cx={cx}
                cy={cy}
                r={3}
                fill={d?.color || "hsl(199, 89%, 48%)"}
                stroke="hsl(var(--card))"
                strokeWidth={1.5}
              />
            );
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const DonutChart = ({ panel }: MiniChartProps) => {
  const test = panel.tests.find((t) => t.name.includes("HbA1c")) || panel.tests[0];
  if (!test) return null;

  const max = parseFloat(test.normalRange.split("-")[1]) * 2 || test.value * 1.5;
  const pct = Math.min(100, (test.value / max) * 100);
  const data = [{ value: pct, fill: statusColor(test.status) }];

  return (
    <div className="relative w-full h-[48px] flex items-center justify-center">
      <ResponsiveContainer width={48} height={48}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={5}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <span className="absolute text-[9px] font-bold text-foreground">{test.rawValue.split(" ")[0]}</span>
    </div>
  );
};

const DualBarChart = ({ panel }: MiniChartProps) => {
  const data = panel.tests.slice(0, 5).map((t) => ({
    name: t.name.length > 8 ? t.name.slice(0, 8) : t.name,
    value: t.value,
    color: statusColor(t.status),
  }));

  return (
    <ResponsiveContainer width="100%" height={48}>
      <BarChart data={data} barCategoryGap="20%">
        <Tooltip
          contentStyle={{
            background: "hsl(220, 20%, 10%)",
            border: "1px solid hsl(220, 15%, 20%)",
            borderRadius: "8px",
            fontSize: "10px",
            color: "#fff",
          }}
        />
        <Bar dataKey="value" radius={[3, 3, 0, 0]} animationDuration={1200} animationEasing="ease-out">
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const chartTypeMap: Record<string, "sparkline" | "donut" | "bars"> = {
  "Blood Health (Complete Blood Count)": "sparkline",
  "Kidney Function": "bars",
  "Liver Health": "bars",
  "Blood Sugar": "donut",
  "Lipid Profile": "bars",
  "Anemia Profile": "bars",
  "Electrolytes": "sparkline",
  "Inflammation": "bars",
  "Thyroid Function": "sparkline",
  "Urine Routine": "sparkline",
};

const MiniChart = ({ panel }: MiniChartProps) => {
  const chartType = chartTypeMap[panel.name] || "sparkline";

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="origin-left"
    >
      {chartType === "donut" && <DonutChart panel={panel} />}
      {chartType === "bars" && <DualBarChart panel={panel} />}
      {chartType === "sparkline" && <SparklineChart panel={panel} />}
    </motion.div>
  );
};

export default MiniChart;
