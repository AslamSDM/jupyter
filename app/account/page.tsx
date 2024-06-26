"use client";
import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, Link, Tabs, Tab } from "@nextui-org/react";
import SuppliedAssetsTable from "@/components/suppliedAssetsTable";
import BorrowedAssetsTable from "@/components/borrowedAssetsTable";

import { useAccount, useContractRead, useContractReads } from "wagmi";
import axios from "axios";
import { vTokenabi } from "@/components/abi/vTokenabi";
import { bsc } from "viem/chains";
import { AbiItem, createPublicClient, formatUnits, http } from "viem";
import { newcomptrollerabi } from "@/components/abi/comptrollerabi";
import { getExchangeRate, getRate } from "../utils/formatNumber";
import { oracleabi } from "@/components/abi/oracleabi";
import { MoonLoader } from "react-spinners";
import { match } from "assert";

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(),
});
function Page() {
  const { isConnected, address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [core_pools, setCorepools] = useState<any>([]);
  const [isolated_pools, setIsolatedpools] = useState<any>([]);
  const [corecomptroller, setCorecomptroller] = useState<any>("");
  const [coreassets, setCoreassets] = useState<any>([]);
  const [isolatedassets, setIsolatedassets] = useState<any>([]);
  const [isolatedcomptrollers, setIsolatedcomptrollers] = useState<any>([]);

  useEffect(() => {
    async function fetchPools() {
      const response = await axios.get(
        "https://api.venus.io/markets/core-pool?limit=60"
      );
      setCorepools(response.data.result);
      const comptroller = await bscClient.readContract({
        address: response.data.result[0].address,
        abi: vTokenabi,
        functionName: "comptroller",
      });
      setCorecomptroller(comptroller);
      if (!comptroller) return;
      if (!isConnected) return;
      let coreassets: any[] = (await bscClient.readContract({
        address: comptroller as `0x${string}`,
        abi: newcomptrollerabi,
        functionName: "getAssetsIn",
        args: [address],
      })) as any[];
      if (!coreassets) return;
      if (!Array.isArray(coreassets)) return;
      const temp = response.data.result.map((p: any) => {
        if (coreassets.includes(p.address)) {
          return p;
        }
      });
      coreassets = temp.filter((p: any) => p != undefined);

      const core_asset_supply = await bscClient.multicall({
        contracts: coreassets.map((p: any) => ({
          address: p.address,
          abi: vTokenabi as AbiItem[],
          functionName: "balanceOf",
          args: [address],
        })),
      });
      const core_asset_borrow = await bscClient.multicall({
        contracts: coreassets.map((p: any) => ({
          address: p.address,
          abi: vTokenabi as AbiItem[],
          functionName: "borrowBalanceStored",
          args: [address],
        })),
      });

      coreassets = coreassets.map((p: any, i: number) => ({
        ...p,
        supply:
          Number(formatUnits(core_asset_supply[i].result as bigint, 8)) /
          Number(
            getExchangeRate(p.exchangeRateMantissa, 8, p.underlyingDecimal)
          ),
        borrow: formatUnits(
          core_asset_borrow[i].result as bigint,
          p.underlyingDecimal
        ),
      }));

      setCoreassets(coreassets);
    }
    async function fetchData() {
      const res = await fetch("/api/isolatedpools?chain=bsc");
      const data = await res.json();
      const pools_json = JSON.parse(data);
      let isolated_comp: any = [];
      pools_json.forEach((pool: any) => {
        if (!isolated_comp.includes(pool.comptroller)) {
          isolated_comp.push({
            comptroller: pool.comptroller,
            priceOracle: pool.priceOracle,
            name: pool.name,
          });
        }
      });
      setIsolatedpools(pools_json);
      setIsolatedcomptrollers(isolated_comp);
      let isolatedassets: any = await bscClient.multicall({
        contracts: isolated_comp.map((p: any) => ({
          address: p.comptroller,
          abi: newcomptrollerabi,
          functionName: "getAssetsIn",
          args: [address],
        })),
      });
      const iso_asset_supply = await bscClient.multicall({
        contracts: isolatedassets.map((p: any) => ({
          address:
            p.result.length > 0
              ? String(p.result[0])
              : "0x6592b5DE802159F3E74B2486b091D11a8256ab8A",
          abi: vTokenabi as AbiItem[],
          functionName: "balanceOf",
          args: [address],
        })),
      });
      const iso_asset_borrow = await bscClient.multicall({
        contracts: isolatedassets.map((p: any) => ({
          address:
            p.result.length > 0
              ? String(p.result[0])
              : "0x6592b5DE802159F3E74B2486b091D11a8256ab8A",
          abi: vTokenabi as AbiItem[],
          functionName: "borrowBalanceStored",
          args: [address],
        })),
      });

      const iso_asset_symbol = await bscClient.multicall({
        contracts: isolatedassets.map((p: any, i: number) => {
          let address =
            p.result.length === 1
              ? String(isolatedassets[i].result[0])
              : "0x6592b5DE802159F3E74B2486b091D11a8256ab8A";
          if (!address.startsWith("0x")) {
            address = "0x" + address;
          }
          return {
            address,
            abi: vTokenabi as AbiItem[],
            functionName: "symbol",
          };
        }),
      });
      const iso_asset_price = await bscClient.multicall({
        contracts: isolatedassets.map((p: any, i: number) => ({
          address: "0x6592b5DE802159F3E74B2486b091D11a8256ab8A",
          abi: oracleabi as AbiItem[],
          functionName: "getUnderlyingPrice",
          args: [p.result[0] ?? ""],
        })),
      });

      isolatedassets =  isolatedassets.map( (p: any, i: number) => {
        if (p.result.length == 0) return;
        const all_pools = pools_json.flatMap((pool: any) => pool.vTokens);
        const vToken = all_pools.filter((pool: any) => pool.vToken == p.result);
        return {
          name: isolated_comp[i].name,
          comp: isolated_comp[i].comptroller,
          assets: {
            ...vToken[0],
            underlyingSymbol: String(iso_asset_symbol[i]?.result).match(/v(.*?)_/)?.[1] || "",
            name: "Venus " + (iso_asset_symbol[i].result ? String(iso_asset_symbol[i].result)?.match(/v(.*?)_/)?.[1] : ""),
            price: Number(
              formatUnits(
                (iso_asset_price[i].result as bigint) ?? "",
                vToken[0].underlyingDecimals
              )
            ),
            supply:
              Number(
                formatUnits((iso_asset_supply[i].result as bigint) ?? "", 8)
              ) /
              Number(
                getExchangeRate(
                  vToken[0].exchangeRateCurrent,
                  8,
                  Number(vToken[0].underlyingDecimals)
                )
              ),
            borrow: formatUnits(
              (iso_asset_borrow[i].result as bigint) ?? "",
              vToken[0].underlyingDecimal
            ),
            supplyApy: getRate(
              vToken[0].supplyRatePerBlock,
              Number(vToken[0].underlyingDecimals)
            ),
            borrowApy: getRate(
              vToken[0].borrowRatePerBlock,
              Number(vToken[0].underlyingDecimals)
            ),
          },
        };
      });
      isolatedassets = isolatedassets.filter((p: any) => {
        return p != undefined;
      });
      setIsolatedassets(isolatedassets);
    }
    setLoading(true);
    fetchData();
    fetchPools();
    setLoading(false);
  }, []);
console.log({isolatedassets})
  const core_supply_total = coreassets.reduce(
    (acc: any, cur: any) =>
      acc + (cur.supply * Number(cur.tokenPriceCents)) / 100,
    0
  );
  const core_borrow_total = coreassets.reduce(
    (acc: any, cur: any) =>
      acc + (cur.borrow * Number(cur.tokenPriceCents)) / 100,
    0
  );
  const isolated_supply_total = isolatedassets.reduce(
    (acc: any, cur: any) => acc + cur.assets?.supply * cur.assets?.price,
    0
  );

  const isolated_borrow_total = isolatedassets.reduce(
    (acc: any, cur: any) => acc + cur.assets?.borrow * cur.assets?.price,
    0
  );
  const total_supplied = core_supply_total + isolated_supply_total;
  const total_borrowed = core_borrow_total + isolated_borrow_total;
  const annual_supply_interest_core = coreassets.reduce(
    (acc: any, cur: any) =>
      acc + (cur?.supply * cur.tokenPriceCents * cur.supplyApy) / 10000,
    0
  );
  const annual_borrow_interest_core = coreassets.reduce(
    (acc: any, cur: any) =>
      acc + (cur.borrow * cur.tokenPriceCents * cur.borrowApy) / 10000,
    0
  );
  const annual_supply_interest_iso = isolatedassets.reduce(
    (acc: any, cur: any) =>
      acc + (cur.assets?.supply * cur.assets?.price * cur.assets?.supplyApy) / 100,
    0
  );

  const annual_borrow_interest_iso = isolatedassets.reduce(
    (acc: any, cur: any) =>
      acc + (cur.assets?.borrow * cur.assets?.price * cur.assets?.borrowApy) / 100,
    0
  );
  const total_supply_interest =
    annual_supply_interest_core + annual_supply_interest_iso;
  const total_borrow_interest =
    annual_borrow_interest_core + annual_borrow_interest_iso;

  const core_net_apy =
    ((annual_supply_interest_core - annual_borrow_interest_core) * 100) /
    core_supply_total;
  const iso_net_apy =
    ((annual_supply_interest_iso - annual_borrow_interest_iso) * 100) /
    isolated_supply_total;
  const net_apy =
    ((total_supply_interest - total_borrow_interest) * 100) / total_supplied;
    // const groupedAssets = isolatedassets.reduce((acc:any, asset:any) => {
    //   const key = asset.name;
    //   if (!acc[key]) {
    //     acc[key] = []
    //   }
    //   acc[key].push(asset);
    //   return acc;
    // }, {});
    // const groupedAssetsArray = Object.values(groupedAssets);

    // console.log(groupedAssetsArray);

  if (loading) {
    return (
      <>
        <div className="flex flex-col w-full items-center justify-center h-screen gap-4 ">
          <MoonLoader color="#ffffff" />
          Loading
        </div>
      </>
    );
  } else
    return (
      <>
        <div className="w-full flex flex-col gap-8 px-10 py-8">
          <div className="flex justify-between">
            <h2 className="text-xl text-white font-bold">Account</h2>
            <ConnectButton />
          </div>

          <h2 className="text-xl text-white font-bold">Summary</h2>
          <div className="w-full rounded-xl bg-[#1E2431] flex justify-start gap-10 p-6 font-semibold text-xl">
            <div className="flex flex-col">
              <p className="text-gray-400">Net APY</p>
              <p className="text-green-400">{net_apy.toFixed(2)}%</p>
            </div>
            {/* <div className="flex flex-col">
        <div className="h-full w-px bg-gray-600"></div>
   <p className="text-gray-400">Daily Earnings</p>
          <p className="text-white">100</p>
        </div> */}
            <div className="h-full w-px bg-gray-600"></div>
            <div className="flex flex-col">
              <p className="text-gray-400">Total Supply</p>
              <p className="text-white">${total_supplied.toFixed(2)}</p>
            </div>
            <div className="h-full w-px bg-gray-600"></div>
            <div className="flex flex-col">
              <p className="text-gray-400">Total Borrow</p>
              <p className="text-white">${total_borrowed.toFixed(2)}</p>
            </div>
            {/* <div className="h-full w-px bg-gray-600"></div>
     <div className="flex flex-col">
          <p className="text-gray-400">Total Vault Stake</p>
          <p className="text-white">100</p>
        </div>  */}
          </div>
          <div className="flex flex-col gap-4 items-start">
            <h2 className="text-xl text-white font-bold">Pools</h2>
            {/* <div className="flex gap-4">
            <Button
              href="/core-pool"
              as={Link}
              color="primary"
              radius="full"
              size="sm"
            >
              Venus Core Pool
            </Button>
            <Button
              href="/core-pool"
              as={Link}
              color="warning"
              radius="full"
              size="sm"
              className="text-white"
            >
              GameFi
            </Button>
            
          </div> */}
            {/* <Tabs variant="bordered">
            <Tab key="core-pool" title="Venus Core Pool">
              <div className="flex gap-4">Hello</div>
            </Tab>
            <Tab key="gamefi" title="GameFi">
              <div className="flex gap-4">Hi</div>
            </Tab>
          </Tabs> */}

          </div>
          <Tabs variant="light">
          {
            coreassets.length > 0 && (
              
          <Tab key="core-pool" title="Venus Core Pool">
            <div className="space-y-4">
            <h2 className="text-xl text-white font-bold">Summary</h2>
            <div className="w-full rounded-xl bg-[#1E2431] flex justify-between p-6 font-semibold text-xl">
              <div className="flex justify-start gap-10">
                <div className="flex flex-col">
                  <p className="text-gray-400">Net APY</p>
                  <p className="text-green-400">{core_net_apy.toFixed(2)}</p>
                </div>
                {/* <div className="h-full w-px bg-gray-600"></div>
                <div className="flex flex-col">
                  <p className="text-gray-400">Daily Earnings</p>
                  <p className="text-white">100</p>
                </div> */}
                <div className="h-full w-px bg-gray-600"></div>
                <div className="flex flex-col">
                  <p className="text-gray-400">Total Supply</p>
                  <p className="text-white">${core_supply_total.toFixed(2)}</p>
                </div>
                <div className="h-full w-px bg-gray-600"></div>
                <div className="flex flex-col">
                  <p className="text-gray-400">Total Borrow</p>
                  <p className="text-white">${core_borrow_total.toFixed(2)}</p>
                </div>
              </div>
              {/* <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-8">
                  <p className="text-gray-400 text-sm">
                    Borrow Limit used: <span className="text-white">0%</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Limit: <span className="text-white">$8.20</span>
                  </p>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-600 h-2.5 dark:bg-blue-500 absolute w-1"
                    style={{ left: "85%" }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm text-end">
                  Your safe limit: <span className="text-white">0%</span>
                </p>
              </div> */}
            </div>
            <div className="flex justify-between items-start w-full">
              <SuppliedAssetsTable className="w-1/2" assets={coreassets} isolated={false} corecomptroller={corecomptroller} />
              <BorrowedAssetsTable className="w-1/2" assets={coreassets} isolated={false} corecomptroller={corecomptroller} />
            </div>
            </div>

          </Tab>
            )
          
          }
            {isolatedassets.length > 0 &&
              isolatedassets.map((pool: any, i: number) => (
                <Tab key={i + 1} title={pool.name}>
                  <div className="space-y-4">

                  <h2 className="text-xl text-white font-bold">Summary</h2>
                  <div className="w-full rounded-xl bg-[#1E2431] flex justify-between p-6 font-semibold text-xl">
                    <div className="flex justify-start gap-10">
                      <div className="flex flex-col">
                        <p className="text-gray-400">Net APY</p>
                        <p className="text-green-400">
                          {iso_net_apy.toFixed(3)}%
                        </p>
                      </div>
                      <div className="h-full w-px bg-gray-600"></div>
                      {/* <div className="flex flex-col">
                      <p className="text-gray-400">Daily Earnings</p>
                      <p className="text-white">100</p>
                      <div className="h-full w-px bg-gray-600"></div>
                    </div> */}
                      <div className="flex flex-col">
                        <p className="text-gray-400">Total Supply</p>
                        <p className="text-white">${isolated_supply_total.toFixed(2)}</p>
                      </div>
                      <div className="h-full w-px bg-gray-600"></div>
                      <div className="flex flex-col">
                        <p className="text-gray-400">Total Borrow</p>
                        <p className="text-white">${isolated_borrow_total.toFixed(2)}</p>
                      </div>
                    </div>
                    {/* <div className="flex flex-col gap-2">
                      <div className="flex justify-between gap-8">
                      <p className="text-gray-400 text-sm">
                          Borrow Limit used:{" "}
                          <span className="text-white">0%</span>
                        </p>
                        <p className="text-gray-400 text-sm">
                        Limit: <span className="text-white">$8.20</span>
                        </p>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-2.5">
                        <div
                        className="bg-red-600 h-2.5 dark:bg-blue-500 absolute w-1"
                        style={{ left: "85%" }}
                        ></div>
                        </div>
                        <p className="text-gray-400 text-sm text-end">
                        Your safe limit: <span className="text-white">0%</span>
                        </p>
                      </div> */}
                  </div>
                  <div className="flex justify-between items-start w-full">
                    {pool.assets ? (
                      <>
                        <SuppliedAssetsTable assets={[pool.assets]} isolated={true} />
                        <BorrowedAssetsTable assets={[pool.assets]} isolated={true} />
                      </>
                    ) : null}
                  </div>
              </div>
                </Tab>
              ))}
          </Tabs>
        </div>
      </>
    );
}

export default Page;
