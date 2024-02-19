"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";

const AreaChartComponent = ({
  data,
  yFieldLabel,
  yFieldName,
  color,
  tooltipFieldName,
  tooltipFieldLabel,
}: any) => {
  const [loading, setLoading] = useState(false);
  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-400 p-4 rounded-md shadow-md text-neutral-800 text-sm font-medium">
          <p>{`Date : ${payload[0].payload.date}`}</p>
          <p>
            {`${yFieldLabel} : ${payload[0]?.payload[yFieldName].slice(0, 4)}%`}
          </p>
          <p>{`${tooltipFieldLabel} : ${payload[0]?.payload[tooltipFieldName]}`}</p>
        </div>
      );
    }
    return null;
  }, []);

  const maxVal = Math.max(...data.map((item: any) => item[yFieldName]));
  const interval = maxVal / 5;
  const ticks = [
    0,
    interval,
    interval * 2,
    interval * 3,
    interval * 4,
    interval * 5,
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex max-md:flex-col max-md:gap-3 md:items-center justify-between">
        {/* <div className="flex items-center gap-2">
          <h3 className="text-neutral-200 text-[16px]">AAVE/USD</h3>
          <p className="text-neutral-600 text-[16px]">V3 Uniswap (Ethereum)</p>
        </div> */}
      </div>
      <div className="max-md:w-[110%] md:w-full -translate-x-[32px] md:-translate-x-[24px]">
        <ResponsiveContainer width="105%" height={400}>
          <AreaChart
            width={790}
            height={300}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient
                id={`${color}colorVal`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              axisLine={{ display: "none" }}
              // tickLine={{ display: "none" }}
              dataKey="date"
              tickMargin={20}
              tick={{ fontSize: 12 }}
              ticks={[data[5]?.date, data[180]?.date, data[360]?.date]}
            />
            <YAxis
              axisLine={{ display: "none" }}
              tickLine={{ display: "none" }}
              dataKey={yFieldName}
              tickFormatter={(val) => `${val.toFixed(2)}%`}
              ticks={ticks}
              domain={["auto", "auto"]}
            />
            {ticks.map((tick, index) => (
              <ReferenceLine key={index} y={tick} stroke="#808080" />
            ))}
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ backgroundColor: "blue", borderRadius: "12px" }}
            />
            <Area
              type="monotone"
              dataKey={yFieldName}
              stroke={color}
              fillOpacity={1}
              fill={`url(#${color}colorVal)`}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartComponent;
