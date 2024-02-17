"use client";
import React, { useState, useEffect } from "react";
import PoolTable from "@/components/poolTable";
import axios from "axios";
import { CircularProgress } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "asset", label: "Asset" },
    { key: "totalSupply", label: "Total supply" },
    { key: "supplyApy", label: "Supply APY" },
    { key: "totalBorrow", label: "Total borrow" },
    { key: "borrowApy", label: "Borrow APY" },
    { key: "liquidity", label: "Liquidity" },
    { key: "price", label: "Price" },
  ];

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
        "https://api.venus.io/markets/core-pool?limit=60"
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
        <h2 className="text-xl text-white font-bold">Dashboard</h2>
        <ConnectButton />
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
