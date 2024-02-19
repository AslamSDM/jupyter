import React, { useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function LineChartComponent() {
  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-400 p-4 rounded-md shadow-md text-neutral-800 text-sm font-medium">
          <p>{`Borrow APY : ${payload[0].payload.borrowApy}%`}</p>
          <p>{`Supply APY : ${payload[0].payload.supplyApy}%`}</p>
          <p>{`Utilization Rate : ${label}%`}</p>
        </div>
      );
    }
    return null;
  }, []);
  const data = [];

  for (let i = 0; i < 100; i++) {
    data.push({
      borrowApy: parseFloat((Math.random() * 100).toFixed(2)), // random number between 0 and 100 with max 2 decimal points
      supplyApy: parseFloat((Math.random() * 100).toFixed(2)), // random number between 0 and 100 with max 2 decimal points
      utilizationRate: parseFloat((Math.random() * 100).toFixed(2)), // random number between 0 and 100 with max 2 decimal points
    });
  }
  data.sort((a, b) => a.utilizationRate - b.utilizationRate);

  const ticks = [25, 50, 75, 100];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        {ticks.map((tick, index) => (
          <ReferenceLine key={index} y={tick} stroke="#606060" />
        ))}
        <XAxis
          type="number"
          ticks={ticks}
          tickFormatter={(val) => `${val}%`}
          domain={[0, 100]}
          dataKey="utilizationRate"
        />
        <YAxis
          tickFormatter={(val) => `${val}%`}
          ticks={ticks}
          axisLine={{ display: "none" }}
        />
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{ backgroundColor: "blue", borderRadius: "12px" }}
        />
        <Legend />
        <Line
          dot={false}
          type="monotone"
          dataKey="supplyApy"
          stroke="#8884d8"
          name="Supply APY"
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="borrowApy"
          stroke="#82ca9d"
          name="Borrow APY"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;
