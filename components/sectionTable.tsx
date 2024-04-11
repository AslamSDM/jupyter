import React, { useState, useEffect, useCallback } from "react";
import Logo from "../assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import getImage from "./abi/tokenImage";
import { get } from "http";
import {
  decodeMantissa,
  formatNumber,
  getRate,
} from "@/app/utils/formatNumber";
import { formatUnits } from "viem";
import { useContractRead, useContractReads } from "wagmi";
import { isolatedtokens } from "@/config/isolatedtokens";
import { useParams } from "next/navigation";

function PoolTable({ tableData, columns, poolType, priceData }: any) {
  const [pools, setPools] = useState(tableData);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  console.log(pools);
  console.log(priceData);
  const { section } = useParams<{ section: string }>();
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
  }, [sortKey, tableData, pools]);

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

  const renderCell = useCallback(
    (user: any, columnKey: any) => {
      const symbol = isolatedtokens.find(
        (token: any) =>
          token.id.toLocaleLowerCase() === user.vToken.toLocaleLowerCase()
      )?.underlyingSymbol;
      switch (columnKey) {
        case "asset":
          return (
            <div className="flex items-center gap-1 pl-2">
              <Image
                src={getImage("Venus " + symbol)}
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
                {formatNumber(formatUnits(user.totalSupply, 6))} {symbol}
                <p className="text-slate-400">
                  $
                  {priceData[user.vToken]
                    ? formatNumber(
                        (
                          Number(priceData[user.vToken]["totalSupply"]) * 100
                        ).toString()
                      )
                    : 0}
                </p>
              </p>
            </div>
          );

        case "supplyApy":
          return (
            <div className="flex flex-col">
              <p className="text-white">
                {Number(
                  getRate(user.supplyRatePerBlock, user.underlyingDecimals)
                ).toFixed(3)}
                %
              </p>
              {/* <p className="text-slate-400">{(Number(user.supplyXvsApy)).toFixed(3)} XVS</p> */}
            </div>
          );
        case "totalBorrow":
          return (
            <div className="flex flex-col">
              <p className="text-white">
                {formatNumber(
                  String(Number(formatUnits(user.totalBorrows, 18)) * 100)
                )}{" "}
                {symbol}
                <p className="text-slate-400">
                  $
                  {priceData[user.vToken]
                    ? formatNumber(
                        (
                          Number(priceData[user.vToken]["totalBorrow"]) * 100
                        ).toString()
                      )
                    : 0}
                </p>
              </p>
            </div>
          );
        case "borrowApy":
          return (
            <div className="flex flex-col">
              <p className="text-white">
                {Number(
                  getRate(user.borrowRatePerBlock, user.underlyingDecimals)
                ).toFixed(3)}
                %
              </p>
              {/* <p className="text-slate-400">{(Number(user.borrowApy)-Number(user.borrowXvsApy)).toFixed(3)} XVS</p> */}
            </div>
          );

        case "liquidity":
          return (
            <div className="flex flex-col">
              <p className="text-white">
                {formatNumber(
                  (
                    (Number(formatUnits(user.totalSupply, 8)) -
                      Number(formatUnits(user.totalBorrows, 18))) *
                    100
                  ).toString()
                )}{" "}
                {user.symbol}
                <p className="text-slate-400">
                  $
                  {priceData[user.vToken]
                    ? formatNumber(
                        (
                          (Number(priceData[user.vToken]["totalSupply"]) -
                            Number(priceData[user.vToken]["totalBorrow"])) *
                          100
                        ).toString()
                      )
                    : 0}
                </p>
              </p>
            </div>
          );

        case "price":
          return (
            <p className="pr-2">
              {" "}
              $
              {priceData[user.vToken]
                ? formatNumber(
                    Number(priceData[user.vToken]["price"]).toString()
                  )
                : 0}
            </p>
          );

        default:
          return null;
      }
    },
    [priceData]
  );
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block py-6 text-white bg-[#1E2431] rounded-3xl">
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
                      href={`/isolated-pools/${section}/${pool.vToken}`}
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
      {/* Mobile View */}
      <div className="md:hidden w-full flex flex-col gap-8 justify-start mb-28">
        {pools.map((pool: any, index: number) => {
          const symbol = isolatedtokens.find(
            (token: any) =>
              token.id.toLocaleLowerCase() === pool.vToken.toLocaleLowerCase()
          )?.underlyingSymbol;
          return (
            <div
              key={index}
              className="bg-[rgb(30,36,49)] rounded-xl p-4 flex flex-col gap-4"
            >
              {/* Pool logo and symbol */}
              <div className="flex justify-start items-center gap-2">
                <Image
                  src={getImage("Venus " + symbol)} // Fetching pool image based on its name
                  alt="logo"
                  width={24}
                  height={24}
                />
                <p className="text-white">{symbol}</p>{" "}
                {/* Displaying pool symbol */}
              </div>
              {/* Horizontal line */}
              <div className="h-px w-full bg-gray-400" />
              {/* Pool information */}
              <div className="flex justify-between items-start">
                {/* Left section */}
                <div className="flex flex-col justify-start gap-2 w-1/2">
                  <p className="text-[#AAB3CA] text-xs">Total Supply</p>

                  <p className="text-white text-sm">
                    {formatNumber(formatUnits(pool.totalSupply, 6))} {symbol}
                  </p>
                  <p className="text-[#AAB3CA] text-xs">
                    $
                    {priceData[pool.vToken]
                      ? formatNumber(
                          (
                            Number(priceData[pool.vToken]["totalSupply"]) * 100
                          ).toString()
                        )
                      : 0}
                  </p>
                </div>
                {/* Right section */}
                <div className="flex flex-col justify-start gap-2 w-1/2">
                  <p className="text-[#AAB3CA] text-xs">Supply APY/LTV</p>
                  <p className="text-white text-sm">
                    {Number(
                      getRate(pool.supplyRatePerBlock, pool.underlyingDecimals)
                    ).toFixed(3)}
                    %
                  </p>
                  {/* <p className="text-[#AAB3CA] text-xs">$0</p> */}
                </div>
              </div>
              {/* Pool APY */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col justify-start gap-2 w-1/2">
                  <p className="text-[#AAB3CA] text-xs">Total Borrow</p>
                  <p className="text-white text-sm">
                    {formatNumber(
                      String(Number(formatUnits(pool.totalBorrows, 18)) * 100)
                    )}{" "}
                    {symbol}
                  </p>
                  <p className="text-[#AAB3CA] text-xs">
                    $
                    {priceData[pool.vToken]
                      ? formatNumber(
                          (
                            Number(priceData[pool.vToken]["totalBorrow"]) * 100
                          ).toString()
                        )
                      : 0}
                  </p>
                </div>
                <div className="flex flex-col justify-start gap-2 w-1/2">
                  <p className="text-[#AAB3CA] text-xs">Borrow APY</p>
                  <p className="text-white text-sm">
                    {Number(
                      getRate(pool.borrowRatePerBlock, pool.underlyingDecimals)
                    ).toFixed(3)}
                    %
                  </p>
                </div>
              </div>
              {/* Pool Liquidity */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col justify-start gap-2 w-1/2">
                  <p className="text-[#AAB3CA] text-xs">Liquidity</p>
                  <p className="text-white text-sm">
                    {formatNumber(
                      (
                        (Number(formatUnits(pool.totalSupply, 8)) -
                          Number(formatUnits(pool.totalBorrows, 18))) *
                        100
                      ).toString()
                    )}{" "}
                    {pool.symbol}
                  </p>
                  <p className="text-[#AAB3CA] text-xs">
                    {priceData[pool.vToken]
                      ? formatNumber(
                          (
                            (Number(priceData[pool.vToken]["totalSupply"]) -
                              Number(priceData[pool.vToken]["totalBorrow"])) *
                            100
                          ).toString()
                        )
                      : 0}
                  </p>
                </div>
                <div className="flex flex-col justify-start gap-2 w-1/2">
                  <p className="text-[#AAB3CA] text-xs">Price</p>
                  <p className="text-white text-sm">
                    {" "}
                    $
                    {priceData[pool.vToken]
                      ? formatNumber(
                          Number(priceData[pool.vToken]["price"]).toString()
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PoolTable;
