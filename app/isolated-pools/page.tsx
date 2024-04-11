"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useContractReads } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CircularProgress } from "@nextui-org/react";
import IsolatedPoolsTable from "@/components/isolatedPoolsTable";
import { formatUnits } from "viem";
import { oracleabi } from "@/components/abi/oracleabi";
import { formatNumber } from "../utils/formatNumber";
import { bsc } from "viem/chains";
import { createPublicClient, http } from "viem";

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(),
});

const IsolatedPoolsPage = () => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState({
    "0x0": { price: 1, decimal: 18 },
  });
  const [totalSupply, setTotalSupply] = useState({
    Stablecoins: { supply: 0, borrow: 0 },
    GameFi: { supply: 0, borrow: 0 },
    DeFi: { supply: 0, borrow: 0 },
    "Liquid Staked BNB": { supply: 0, borrow: 0 },
    Tron: { supply: 0, borrow: 0 },
    borrow: 0,
    supply: 0,
  });
  const [totalTreasury, setTotalTreasury] = useState(0);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch("/api/isolatedpools?chain=bsc");
      const data = await res.json();
      // const graph = await fetch("/api/isolatedpools/graph");
      // const graphData = await graph.json();

      const pools_json = JSON.parse(data);
      setPools(pools_json);
      setLoading(false);
      let totals = {
        Stablecoins: { total_supply: 0, total_borrow: 0 },
        GameFi: { total_supply: 0, total_borrow: 0 },
        DeFi: { total_supply: 0, total_borrow: 0 },
        "Liquid Staked BNB": { total_supply: 0, total_borrow: 0 },
        Tron: { total_supply: 0, total_borrow: 0 },
      };
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchPrices() {
      const f = await bscClient.multicall({
        contracts: pools.flatMap((p: any) =>
          p.vTokens.map((vToken: any) => ({
            address: p.priceOracle,
            abi: oracleabi,
            functionName: "getUnderlyingPrice",
            args: [vToken.vToken],
          }))
        ),
      });
      console.log(f);
      if (f === undefined) {
        return;
      }

      if (Array.isArray(f) && f?.length === 0) return;
      if (f.length === 0 || !f) return;
      let priceData_temp: any = {};
      let total: any = {};
      let vTokens = pools.flatMap((pool: any) => pool.vTokens);

      vTokens.forEach((vToken: any, i: number) => {
        if (vToken && vToken.vToken && f && i < f.length && f[i]?.result) {
          priceData_temp[vToken.vToken] = {
            price: formatUnits(
              f[i]?.result as bigint,
              vToken.underlyingDecimals == 18
                ? 18
                : vToken.underlyingDecimals == 9
                ? 27
                : 30
            ),
            decimal: vToken.underlyingDecimals,
            totalSupply:
              Number(formatUnits(vToken.totalSupply, 8)) *
              Number(
                formatUnits(
                  f[i]?.result as bigint,
                  vToken.underlyingDecimals == 18
                    ? 18
                    : vToken.underlyingDecimals == 9
                    ? 27
                    : 30
                )
              ),
            totalBorrow:
              Number(formatUnits(vToken.totalBorrows, 18)) *
              Number(
                formatUnits(
                  f[i]?.result as bigint,
                  vToken.underlyingDecimals == 18
                    ? 18
                    : vToken.underlyingDecimals == 9
                    ? 27
                    : 30
                )
              ),
            rawtotalBorrow: vToken.totalBorrows,
          };
          total["supply"] = total["supply"] || 0;
          total["borrow"] = total["borrow"] || 0;
          total["supply"] += priceData_temp[vToken.vToken]?.totalSupply;
          total["borrow"] += priceData_temp[vToken.vToken]?.totalBorrow;
        } else {
          priceData_temp[vToken?.vToken] = null;
        }
        setPriceData(priceData_temp);
      });
      pools.forEach((pool: any) => {
        pool.vTokens.forEach((vToken: any) => {
          total[pool.name] = total[pool.name] || { supply: 0, borrow: 0 };
          total[pool.name]["supply"] +=
            priceData_temp[vToken.vToken]?.totalSupply;
          total[pool.name]["borrow"] +=
            priceData_temp[vToken.vToken]?.totalBorrow;
        });
      });
      setTotalSupply(total);
      return f;
    }
    fetchPrices();
  }, [pools]);
  console.log(totalSupply);
  // const oracles = useContractReads({
  //   contracts: pools.flatMap((p: any) =>
  //   p.vTokens.map((vToken: any) => ({
  //     address: p.priceOracle,
  //     abi: oracleabi,
  //     functionName: "getUnderlyingPrice",
  //     args: [vToken.vToken],
  //   }))
  // ),
  //   enabled: true,

  // });
  // useEffect(() => {
  //   if (oracles.data === undefined) {
  //     oracles.refetch();
  //     console.log("refresh");
  //     return;
  //   }
  //   if (priceData["0x0"] === undefined) {
  //     return
  //   }
  //   if (Array.isArray(oracles.data) && oracles.data.length === 0) return;
  //   if (oracles.data.length === 0 || !oracles.data) return;
  //   let priceData_temp: any = {};
  //   let total: any = {};
  //   let vTokens = pools.flatMap((pool: any) => pool.vTokens);

  //   vTokens.forEach((vToken: any, i: number) => {

  //     if (
  //       vToken &&
  //       vToken.vToken &&
  //       oracles &&
  //       oracles.data &&
  //       i < oracles.data.length
  //       && oracles.data[i]?.result
  //     ) {
  //       priceData_temp[vToken.vToken] = {
  //         price: formatUnits(oracles.data[i]?.result as bigint,vToken.underlyingDecimals==18?18:(vToken.underlyingDecimals==9?27:30)),
  //         decimal: vToken.underlyingDecimals,
  //         totalSupply: Number(formatUnits(vToken.totalSupply,8)) * Number(formatUnits(oracles.data[i]?.result as bigint,vToken.underlyingDecimals==18?18:(vToken.underlyingDecimals==9?27:30))),
  //         totalBorrow: Number(formatUnits(vToken.totalBorrows,18)) * Number(formatUnits(oracles.data[i]?.result as bigint,vToken.underlyingDecimals==18?18:(vToken.underlyingDecimals==9?27:30))),
  //         rawtotalBorrow: vToken.totalBorrows,
  //       };
  //       total["supply"] = total["supply"] || 0;
  //       total["borrow"] = total["borrow"] || 0;
  //       total["supply"] += priceData_temp[vToken.vToken]?.totalSupply;
  //       total["borrow"] += priceData_temp[vToken.vToken]?.totalBorrow;
  //     } else {
  //       priceData_temp[vToken?.vToken] = null;
  //     }
  //     setPriceData(priceData_temp);
  //   });
  //       pools.forEach((pool: any) => {
  //         pool.vTokens.forEach((vToken: any) => {
  //           total[pool.name] = total[pool.name] || { supply: 0, borrow: 0 };
  //           total[pool.name]["supply"] += priceData_temp[vToken.vToken]?.totalSupply;
  //           total[pool.name]["borrow"] += priceData_temp[vToken.vToken]?.totalBorrow;
  //     });});
  //     setTotalSupply(total);
  // }, [oracles,pools,priceData]);

  const columns = [
    {
      key: "assets",
      label: "Assets",
    },
    {
      key: "pool",
      label: "Pool",
    },
    {
      key: "totalSupply",
      label: "Total Supply",
    },
    {
      key: "totalBorrow",
      label: "Total Borrow",
    },
    {
      key: "liquidity",
      label: "Liquidity",
    },
  ];
  return (
    <div className="w-full flex flex-col gap-10 px-10 py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-white font-bold">Isolated pools</h2>
        <div className="hidden md:block">
          <ConnectButton />
        </div>
      </div>
      <div className="w-full rounded-xl bg-[#1E2431] flex justify-start gap-4 md:gap-10 p-3 md:p-6 font-semibold text-xs md:text-xl">
        <div className="flex flex-col">
          <p className="text-gray-400">Total Supply</p>
          <p className="text-white">
            ${formatNumber(String(totalSupply.supply * 100))}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400">Total Borrow</p>
          <p className="text-white">
            ${formatNumber(String(totalSupply.borrow * 100))}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400">Available Liquidity</p>
          <p className="text-white">
            $
            {formatNumber(
              String((totalSupply.supply - totalSupply.borrow) * 100)
            )}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400">Total Treasury</p>
          <p className="text-white">30</p>
        </div>
      </div>
      {loading ? (
        <div className="w-full flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <IsolatedPoolsTable
          columns={columns}
          pools={pools}
          total={totalSupply}
        />
      )}
    </div>
  );
};
export default IsolatedPoolsPage;
