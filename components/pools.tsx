"use client";
import React, { useState, useEffect, useCallback } from "react";
import { columns } from "./dummyData";
import axios from "axios";
import { BigNumber } from "bignumber.js";
import Link from "next/link";
import Logo from "../assets/logo.svg";
import Image from "next/image";
import { CircularProgress } from "@nextui-org/react";

export default function Pools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const handleSorting = (key: string) => {
    setSortKey(key);
    setSortOrder((prevSortOrder) =>
      prevSortOrder ? (prevSortOrder === "asc" ? "desc" : "asc") : "asc"
    );
  };

  useEffect(() => {
    if (!sortKey) return;
    const sortedPools = [...pools].sort((a: any, b: any) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "number" && typeof bValue === "number")
        return aValue - bValue;
      else if (typeof aValue === "string" && typeof bValue === "string")
        return aValue.localeCompare(bValue);
      else return 0;
    });
    setPools(sortedPools);
  }, [sortKey,pools]);

  useEffect(() => {
    const reversedPools = [...pools].reverse();
    setPools(reversedPools);
  }, [sortOrder,pools]);
  console.log(pools);
  const renderHeaderCell = useCallback((columnKey: any) => {
    switch (columnKey) {
      case "asset":
        return (
          <div
            className="p-4 flex items-center text-start pl-6"
            onClick={() => handleSorting("name")}
          >
            <p className="">Asset</p>
          </div>
        );

      case "totalSupply":
        return (
          // <div className="flex flex-col">
          <p className="p-4" onClick={() => handleSorting("totalSupplyUsd")}>
            Total Supply
          </p>
          // </div>
        );

      case "supplyApy":
        return (
          <div
            className=" p-4 flex justify-end"
            onClick={() => handleSorting("supplyApy")}
          >
            <p className="">Supply APY / LTV</p>
          </div>
        );

      case "totalBorrow":
        return (
          <div
            className="p-4 flex justify-end"
            onClick={() => handleSorting("totalBorrowUsd")}
          >
            <p className="">Total Borrow</p>
          </div>
        );

      case "borrowApy":
        return (
          <p className="p-4" onClick={() => handleSorting("borrowApy")}>
            Borrow APY
          </p>
        );

      case "liquidity":
        return (
          <div
            className="p-4 flex flex-col justify-end"
            onClick={() => handleSorting("liquidityUsd")}
          >
            <p className="">Liquidity</p>
          </div>
        );

      case "price":
        return (
          <p className="p-4 pr-6" onClick={() => handleSorting("price")}>
            Price
          </p>
        );

      default:
        return null;
    }
  }, []);

  const renderCell = useCallback((user: any, columnKey: any) => {
    switch (columnKey) {
      case "asset":
        return (
          <div className="flex items-center gap-1">
            <Image src={Logo} alt="logo" width={24} height={24} />
            {/* <img src={Logo} alt="logo" className="w-6 h-6 mr-2" /> */}
            <p className="text-white">{user.name}</p>
          </div>
        );

      case "totalSupply":
        return (
          <div className="flex flex-col">
            <p className="text-white">
              {user.totalSupplyCoin} {user.name}
            </p>
            <p className="text-slate-400">{user.totalSupplyUsd}</p>
          </div>
        );

      case "supplyApy":
        return (
          <div className="flex flex-col">
            <p className="text-white">{user.supplyApy}%</p>
            <p className="text-slate-400">{user.ltv}%</p>
          </div>
        );

      case "totalBorrow":
        return (
          <div className="flex flex-col">
            <p className="text-white">
              {user.totalBorrowCoin} {user.name}
            </p>
            <p className="text-slate-400">${user.totalBorrowUsd}</p>
          </div>
        );
      case "borrowApy":
        return <p>{user.borrowApy}%</p>;

      case "liquidity":
        return (
          <div className="flex flex-col">
            <p className="text-white">
              {user.liquidityCoin} {user.name}
            </p>
            <p className="text-slate-400">${user.liquidityUsd}</p>
          </div>
        );

      case "price":
        return <p>{user.price}</p>;

      default:
        return null;
    }
  }, []);

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
    <div
      className="w-full flex flex-col items-center  justify-center bg-[#181d27]"
      aria-label="Core Pool table"
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="w-4/5 py-6 text-white mt-20 bg-[#1E2431] rounded-3xl">
          <table className=" w-full">
            <thead className="w-full grid col-6">
              <tr>
                {columns.map((column) => (
                  <th
                    className="text-[#AAB3CA] text-sm font-normal text-end"
                    key={column.key}
                  >
                    {renderHeaderCell(column.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pools.map((pool: any, index: number) => (
                <Link
                  className="w-full grid col-6"
                  href={`/pool/${pool.address}`}
                  key={index}
                >
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.key} className="text-end px-4">
                        {renderCell(pool, column.key)}
                      </td>
                    ))}
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
