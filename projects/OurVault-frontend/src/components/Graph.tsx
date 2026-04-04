import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", total: 4 },
  { name: "Feb", total: 8 },
  { name: "Mar", total: 9 },
  { name: "Apr", total: 5 },
  { name: "May", total: 4 },
  { name: "Jun", total: 6 },
  { name: "Jul", total: 9 },
  { name: "Aug", total: 10 },
  { name: "Sep", total: 11 },
  { name: "Oct", total: 15 },
  { name: "Nov", total: 7 },
  { name: "Dec", total: 9 },
];

function GraphCard() {
  return (
    <div className="rounded-xl border border-cyan-500/10 bg-gray-900/60 backdrop-blur-md shadow-md">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-white">Overview</p>
          <p className="text-xs text-slate-500">Monthly vault balance (ALGO)</p>
        </div>
        <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">
          {new Date().getFullYear()}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            {/* Gradient */}
            <defs>
              <linearGradient id="colorAlgo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Tooltip */}
            <Tooltip
              cursor={{ stroke: "#06b6d4", strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid rgba(6,182,212,0.2)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "13px",
              }}
              formatter={(value) => [`${value} ALGO`, "Balance"]}
              labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
            />

            {/* X Axis */}
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            {/* Y Axis — shows "X ALGO" */}
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} ALGO`}
              width={65}
            />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="total"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#colorAlgo)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#06b6d4",
                stroke: "#020617",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraphCard;