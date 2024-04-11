"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useEffect } from "react";
import PoolTable from "@/components/poolTable";
import { columns } from "@/components/dummyData";
import axios from "axios";
import { CircularProgress } from "@nextui-org/react";
import { decodeMantissa, formatNumber } from "../utils/formatNumber";
import Logo from "../../assets/logo.svg";
import Image from "next/image";

function Page() {
  const [pools, setPools] = useState([]);
  const [totalData, setTotalData] = useState({
    totalSupply: 0,
    totalBorrow: 0,
    totalLiquidity: 0,
    totalAssets: 0,
  });
  const [loading, setLoading] = useState(true);

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
      console.log(response.data.result);
      let totalSupply = 0;
      let totalBorrow = 0;
      let totalLiquidity = 0;
      let totalAssets = response.data.result.length;
      response.data.result.forEach((item: any) => {
        totalSupply += Number(item.totalsupplyusd) / 100;
        totalBorrow +=
          decodeMantissa(item.totalBorrowsMantissa, 0, 0) *
          Number(item.tokenPriceCents);
        totalLiquidity += Number(item.liquidityCents);
      });

      setTotalData({
        totalSupply,
        totalBorrow,
        totalLiquidity,
        totalAssets,
      });

      setPools(response.data.result);
      setLoading(false);
    }
    fetchPools();
  }, []);

  return (
    <>
      {/* Desktop View */}
      <div className="w-full md:flex flex-col gap-10 px-10 py-8 hidden">
        <div className="flex justify-between">
          <h2 className="text-xl text-white font-bold">Core pool</h2>
          <ConnectButton />
        </div>
        <div className="w-full rounded-xl bg-[#1E2431] flex justify-start gap-4 md:gap-10 p-4 md:p-6 font-semibold text-xs md:text-xl">
          <div className="flex flex-col">
            <p className="text-gray-400">Total Supply</p>
            <p className="text-white">
              ${formatNumber(String(totalData.totalSupply))}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-400">Total Borrow</p>
            <p className="text-white">
              ${formatNumber(String(totalData.totalBorrow))}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-400">Available Liquidity</p>
            <p className="text-white">
              ${formatNumber(String(totalData.totalLiquidity))}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-400">Assets</p>
            <p className="text-white">{totalData.totalAssets}</p>
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

      {/* Mobile View */}
      <div className="w-full flex flex-col md:hidden px-6 py-4 gap-8">
        <h2 className="font-bold text-3xl">Core Pool</h2>
        <div className="w-full rounded-xl bg-[#1E2431] flex justify-start gap-4 md:gap-10 p-4 md:p-6 font-semibold text-xl">
          <div className="flex flex-col">
            <p className="text-gray-400 text-xs">Total Supply</p>
            <p className="text-white text-sm">
              ${formatNumber(String(totalData.totalSupply))}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-400 text-xs">Total Borrow</p>
            <p className="text-white text-sm">
              ${formatNumber(String(totalData.totalBorrow))}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-400 text-xs">Available Liquidity</p>
            <p className="text-white text-sm">
              ${formatNumber(String(totalData.totalLiquidity))}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-400 text-xs">Assets</p>
            <p className="text-white text-sm">{totalData.totalAssets}</p>
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
    </>
  );
}

export default Page;
