"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CircularProgress } from "@nextui-org/react";
import PoolTable from "@/components/sectionTable";
import { columns } from "@/components/dummyData";
import { useContractReads } from "wagmi";
import { oracleabi } from "@/components/abi/oracleabi";
import { formatUnits } from "viem";
import { formatNumber } from "@/app/utils/formatNumber";
import { bsc } from "viem/chains";
import { createPublicClient, http } from "viem";

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(),
});
const Page = () => {
  const { section } = useParams<{ section: string }>();
  const [loading, setLoading] = useState(false);
  const [pool, setPool] = useState<any>([]);
  const [priceData, setPriceData] = useState({
    "0x0": { price: 1, decimal: 18 },
  });
  const [totalSupply, setTotalSupply] = useState({
    supply: 0,
    borrow: 0,
  });
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch("/api/isolatedpools?chain=bsc");
      const data = await res.json();
      const pools_json = JSON.parse(data);
      const pool_ = pools_json.filter((pool: any) => pool.name === section);
      setPool(pool_);
      console.log(pool_);
      setLoading(false);
    }
    fetchData();
  }, [section]);
  useEffect(() => {
    async function fetchPrices() {
      const f = await bscClient.multicall({
        contracts: pool.flatMap((p: any) =>
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
      let vTokens = pool.flatMap((pool: any) => pool.vTokens);

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
      pool.forEach((pool: any) => {
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
  }, [pool]);
  // const oracles = useContractReads({
  //   contracts: pool.flatMap((p: any) =>
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
  //   let vTokens = pool.flatMap((pool: any) => pool.vTokens);

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
  //   pool.forEach((p: any) => {
  //         p.vTokens.forEach((vToken: any) => {
  //           total["supply"] = total["supply"] || 0;
  //           total["borrow"] = total["borrow"] || 0;
  //           total["supply"] += priceData_temp[vToken.vToken]?.totalSupply;
  //           total["borrow"] += priceData_temp[vToken.vToken]?.totalBorrow;
  //     });});
  //   setTotalSupply(total);

  // }, [oracles,pool,priceData]);
  return (
    <>
      {/* Desktop view */}
      <div className="w-full flex flex-col gap-10 px-10 py-8">
        <div className="flex justify-between">
          <h2 className="text-xl text-gray-400 font-bold">
            Isolated pools / <span className="text-white">{section}</span>
          </h2>
          <div className="hidden md:block">
            <ConnectButton />
          </div>
        </div>
        <div className="w-full rounded-xl bg-[#1E2431] flex justify-start gap-4 md:gap-10 p-3 md:p-6 font-semibold text-sm md:text-xl">
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
            <p className="text-gray-400">Assets</p>
            <p className="text-white">{pool.length}</p>
          </div>
        </div>
        {loading ? (
          <div className="w-full flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <PoolTable
            columns={columns}
            tableData={pool[0]?.vTokens || []}
            poolType="isolated"
            priceData={priceData}
          />
        )}
      </div>

      {/* Mobile View */}
    </>
  );
};

export default Page;
