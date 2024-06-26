import React, { useState, useEffect, useCallback } from "react";
import Logo from "../assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import getImage from "./abi/tokenImage";
import { get } from "http";
import { decodeMantissa, formatNumber, getRate } from "@/app/utils/formatNumber";
import { formatUnits } from "viem";
import { useContractRead, useContractReads } from "wagmi";
import { isolatedtokens } from "@/config/isolatedtokens";
import { useParams } from "next/navigation";

function PoolTable({ tableData, columns, poolType,priceData }: any) {
  const [pools, setPools] = useState(tableData);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  console.log(pools);
  console.log(priceData);
  const {section} = useParams<{section:string}>();
  const handleSorting = (key: string) => {
    setSortKey(key);
    setSortOrder((prevSortOrder) =>
      prevSortOrder ? (prevSortOrder === "asc" ? "desc" : "asc") : "asc"
    );
  };
  console.log(pools);
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
  }, [sortKey, tableData,pools]);

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
    const symbol =  (isolatedtokens.find((token:any)=> (token.id).toLocaleLowerCase() ===(user.vToken).toLocaleLowerCase()))?.underlyingSymbol
    switch (columnKey) {
      case "asset":
        return (
          <div className="flex items-center gap-1 pl-2">
            <Image
              src={getImage("Venus "+symbol)}
              alt="logo"
              width={24}
              height={24}
            />
            <p className="text-white">{symbol}</p>
          </div>
        );

      case "totalSupply":
        return (
          <div className="flex flex-col">
            <p className="text-white">
              {(formatNumber(formatUnits(user.totalSupply,6)))} {symbol}

            <p className="text-slate-400">${priceData[user.vToken]? formatNumber((Number(priceData[user.vToken]["totalSupply"])*100).toString()):0}</p>
            </p>
          </div>
        );

      case "supplyApy":
        return (
          <div className="flex flex-col">
            <p className="text-white">{(Number(getRate(user.supplyRatePerBlock,user.underlyingDecimals))).toFixed(3)}%</p>
            {/* <p className="text-slate-400">{(Number(user.supplyXvsApy)).toFixed(3)} XVS</p> */}
          </div>
        );
        case "totalBorrow":
          return (
            <div className="flex flex-col">
          <p className="text-white">
            {(formatNumber(String(Number(formatUnits(user.totalBorrows,18))*100)))} {symbol}
            <p className="text-slate-400">${priceData[user.vToken]? formatNumber((Number(priceData[user.vToken]["totalBorrow"])*100).toString()):0}</p>
          </p>
        </div>
        );
        case "borrowApy":
          return (
            <div className="flex flex-col">
            <p className="text-white">{(Number(getRate(user.borrowRatePerBlock,user.underlyingDecimals))).toFixed(3)}%</p>
          {/* <p className="text-slate-400">{(Number(user.borrowApy)-Number(user.borrowXvsApy)).toFixed(3)} XVS</p> */}
        </div>
        );

      case "liquidity":
        return (
          <div className="flex flex-col">

            <p className="text-white">{formatNumber(((Number(formatUnits(user.totalSupply,8))-Number(formatUnits(user.totalBorrows,18)))*100).toString()) }   {user.symbol}
            <p className="text-slate-400">${priceData[user.vToken]? formatNumber(((Number(priceData[user.vToken]["totalSupply"])-Number(priceData[user.vToken]["totalBorrow"]))*100).toString()):0}</p>
            </p>
          </div>
        );

      case "price":
        return <p className="pr-2"> ${priceData[user.vToken]? formatNumber((Number(priceData[user.vToken]["price"])).toString()):0}</p>;

      default:
        return null;
    }
  }, [priceData]);
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
                    href={`/isolated-pools/${section}/${pool.vToken}`
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
