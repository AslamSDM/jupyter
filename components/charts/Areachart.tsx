"use client";

import { type } from "os";
import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

type Props = {};

const AreaChartComponent = ({ data }: any) => {
  const timeArr = ["1M", "6M", "1Y", "All"];
  const [time, setTime] = useState("All");
  const [filteredChartData, setFilteredChartData] = useState<any[]>(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!filteredChartData) return;
    setLoading(true);
  }, [filteredChartData]);

  useEffect(() => {
    console.log(time);
    if (time === "All") {
      console.log(filteredChartData);
      console.log(data);
      setFilteredChartData(data);
    } else if (time === "1M") {
      setFilteredChartData(data.slice(0, 30));
    } else if (time === "6M") {
      setFilteredChartData(data.slice(0, 180));
    } else if (time === "1Y") {
      setFilteredChartData(data.slice(0, 365));
    } else {
      setFilteredChartData(data);
    }
    // setLoading(false);
  }, [time]);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex max-md:flex-col max-md:gap-3 md:items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-200 text-[16px]">AAVE/USD</h3>
          <p className="text-neutral-600 text-[16px]">V3 Uniswap (Ethereum)</p>
        </div>
        <div className="flex items-center gap-2">
          {timeArr?.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTime(item)}
              className={`${
                item === time ? "bg-zinc-700" : ""
              } text-neutral-200 w-[40px] rounded-md py-[3px] px-2 text-sm font-medium text-[16px]`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="max-md:w-[110%] md:w-full -translate-x-[32px] md:-translate-x-[24px]">
        <ResponsiveContainer width="105%" height={300}>
          <AreaChart
            width={790}
            height={400}
            data={filteredChartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#edcd8f" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#edcd8f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              axisLine={{ display: "none" }}
              tickLine={{ display: "none" }}
              dataKey="name"
            />
            <YAxis
              axisLine={{ display: "none" }}
              tickLine={{ display: "none" }}
              domain={["auto", "auto"]}
            />
            {/* <Tooltip /> */}
            <Area
              type="monotone"
              dataKey="val"
              stroke="#4ADE80"
              fillOpacity={1}
              fill="url(#colorVal)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="pv"
              stroke="#4ADE80"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartComponent;
