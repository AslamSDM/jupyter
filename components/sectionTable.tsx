import React, { useState, useEffect, useCallback } from "react";
import Logo from "../assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import getImage from "./abi/tokenImage";
import { get } from "http";
import { decodeMantissa, formatNumber } from "@/app/utils/formatNumber";
import { formatUnits } from "viem";
import { useContractRead, useContractReads } from "wagmi";

function PoolTable({ tableData, columns, poolType }: any) {
  const [pools, setPools] = useState(tableData);
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
  }, [sortKey, tableData]);

  useEffect(() => {
    const reversedPools = [...pools].reverse();
    setPools(reversedPools);
  }, [sortOrder, tableData]);
  

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
          <div className="p-4 flex justify-end">
            <button onClick={() => handleSorting("supplyApy")}>
              <p className="">Supply APY / LTV</p>
            </button>
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
          <div className="flex items-center gap-1 pl-2">
            <Image
              src={getImage(user.name)}
              alt="logo"
              width={24}
              height={24}
            />
            <p className="text-white">{user.symbol}</p>
          </div>
        );

      case "totalSupply":
        return (
          <div className="flex flex-col">
            <p className="text-white">
              {(Number(formatUnits(user.totalSupply,user.underlyingDecimals)))} {user.symbol}
            {/* <p className="text-slate-400">${formatNumber((Number(user.totalsupplyusd)/100).toString())}</p> */}
            </p>
          </div>
        );

      case "supplyApy":
        return (
          <div className="flex flex-col">
            <p className="text-white">{(Number(user.supplyApy)+Number(user.supplyXvsApy)).toFixed(3)}%</p>
            {/* <p className="text-slate-400">{(Number(user.supplyXvsApy)).toFixed(3)} XVS</p> */}
          </div>
        );
      case "totalBorrow":
        return (
          <div className="flex flex-col">

            <p className="text-white">{formatNumber((decodeMantissa(user.totalBorrowsMantissa,0,0)).toString()) }   {user.symbol}
            <p className="text-slate-400">${formatNumber((decodeMantissa(user.totalBorrowsMantissa,0,0)*Number(user.tokenPriceCents/100)).toString())}  </p>
            </p>
          </div>
        );
      case "borrowApy":
        return (
          <div className="flex flex-col">
          <p className="text-white">{(Number(user.borrowApy)-Number(user.borrowXvsApy)).toFixed(3)}%</p>
          {/* <p className="text-slate-400">{(Number(user.borrowApy)-Number(user.borrowXvsApy)).toFixed(3)} XVS</p> */}
        </div>
        );

      case "liquidity":
        return (
          <div className="flex flex-col">

            <p className="text-white">{formatNumber((Number(user.liquidityCents)*100/Number(user.tokenPriceCents)).toString()) }   {user.symbol}
            <p className="text-slate-400">{formatNumber(user.liquidityCents)}</p>
            </p>
          </div>
        );

      case "price":
        return <p className="pr-2"> $ {Number((user.tokenPriceCents)/100).toFixed(2)} </p>;

      default:
        return null;
    }
  }, []);
  return (
    <div className="py-6 text-white bg-[#1E2431] rounded-3xl">
      <table className="w-full text-md">
        <thead className="text-[#AAB3CA] text-md text-end">
          <tr>
            {columns.map((column: any) => (
              <th scope="col" className="font-medium" key={column.key}>
                {renderHeaderCell(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pools.map((pool: any, index: number) => (
            <tr key={index}>
              {columns.map((column: any) => (
                <td key={column.key} className="text-end px-4">
                  <Link
                    className="w-full grid col-6"
                    href={
                      poolType == "isolated"
                        ? `/isolated-pool/`
                        : `/pool/${pool.address}`
                    }
                  >
                    {renderCell(pool, column.key)}
                  </Link>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PoolTable;
