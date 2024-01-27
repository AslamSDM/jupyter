"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useEffect } from "react";
import PoolTable from "@/components/poolTable";
import { columns } from "@/components/dummyData";
import axios from "axios";
import { CircularProgress } from "@nextui-org/react";

function page() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  function decodeMantissa(
    mantissa: string,
    vdecimals: number,
    udecimals: number
  ): number {
    const value = Number(mantissa);

    const decimals = 18 + udecimals - vdecimals;
    const f = value / Math.pow(10, decimals);
    return Number(f);
  }

  useEffect(() => {
    async function fetchPools() {
      setLoading(true);
      const response = await axios.get(
        "https://testnetapi.venus.io/markets/core-pool?limit=60"
      );
      response.data.result.map((pool: any) => {
        const totalsupply = decodeMantissa(pool.totalSupplyMantissa, 8, 0);
        const exchangeRate = decodeMantissa(pool.exchangeRateMantissa, 8, 18);
        pool.totalsupplyusd =
          totalsupply * exchangeRate * Number(pool.tokenPriceCents);
        return pool;
      });
      response.data.result.sort(
        (a: any, b: any) => Number(b.totalsupplyusd) - Number(a.totalsupplyusd)
      );
      setPools(response.data.result);
      setLoading(false);
    }
    fetchPools();
  }, []);

  return (
    <div className="w-full flex flex-col gap-10 px-10 py-8">
      <div className="flex justify-between">
        <h2 className="text-xl text-white font-bold">Core pool</h2>
        <ConnectButton />
      </div>
      <div className="w-full rounded-xl bg-[#1E2431] flex justify-start gap-10 p-6 font-semibold text-xl">
        <div className="flex flex-col">
          <p className="text-gray-400">Total Supply</p>
          <p className="text-white">$1.45B</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400">Total Borrow</p>
          <p className="text-white">$1.45B</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400">Available Liquidity</p>
          <p className="text-white">$1.45B</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400">Assets</p>
          <p className="text-white">30</p>
        </div>
      </div>
      {loading ? (
        <div className="w-full flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <PoolTable tableData={pools} columns={columns} />
      )}
    </div>
  );
}

export default page;
