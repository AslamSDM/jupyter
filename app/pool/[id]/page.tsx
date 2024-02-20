"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip, Divider, useDisclosure } from "@nextui-org/react";
import AreaChartComponent from "@/components/charts/Areachart";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SupplyModal from "@/components/supplyModal";
import getImage from "@/components/abi/tokenImage";
import { decodeMantissa, formatNumber, getDailyRate, getExchangeRate } from "@/app/utils/formatNumber";
import { formatUnits } from "viem";

const PoolComponent = () => {
  const { id } = useParams();
  const [pool, setPool] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState<any>("supply");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log(pool);
  const [pools, setPools] = useState([]);
  const [totalData, setTotalData] = useState({
    totalSupply: 0,
    totalBorrow: 0,
    totalLiquidity: 0,
    totalAssets: 0,
  });

  useEffect(() => {
    async function fetchPools() {
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
      // console.log(response.data.result);
      let totalSupply = 0;
      let totalBorrow = 0;
      let totalLiquidity = 0;
      let totalAssets = response.data.result.length;
      response.data.result.forEach((item: any) => {
        totalSupply += Number(item.totalsupplyusd)/100;
        totalBorrow += decodeMantissa(item.totalBorrowsMantissa,0,0) * Number(item.tokenPriceCents);
        totalLiquidity += Number(item.liquidityCents);
      });
      setTotalData({
        totalSupply,
        totalBorrow,
        totalLiquidity,
        totalAssets,
      });
      setPools(response.data.result);
    }
    fetchPools();
  }, []);
  console.log(Number(getDailyRate(pool.borrowRatePerBlock,pool.underlyingDecimal))*pool.totalsupplyusd)
  
  const poolInfo = [
    { label: "Token Price", data: formatNumber((pool.tokenPriceCents)) },
    { label: "Market Liquidity", data: formatNumber(Number(totalData.totalLiquidity)?.toString()) },
    { label: "Supplier Count", data: pool.supplierCount },
    { label: "Borrower Count", data: pool.borrowerCount },
    { label: "Supply Cap", data: formatNumber(formatUnits(pool.supplyCapsMantissa??"",pool.underlyingDecimal-2))+" "+pool.underlyingSymbol },
    { label: "Borrow Cap", data: formatNumber(formatUnits(pool.borrowCapsMantissa??"",pool.underlyingDecimal-2))+" "+pool.underlyingSymbol },
    // {
    //   label: "Daily supplying interests",
    //   data: "pool",
    // },
    // { label: "Daily borrowing interests", data: Number(getDailyRate(pool.borrowRatePerBlock,pool.underlyingDecimal))*pool.totalsupplyusd },
    // { label: "Daily XVS distributed", data: "pool" },
    { label: "Reserves", data: Number(formatUnits(pool.totalReservesMantissa??"",pool.underlyingDecimal)).toFixed(4)+" "+pool.underlyingSymbol },
    { label: "Reserve Factor", data: formatUnits(pool.reserveFactorMantissa??"",16)+"%" },
    {
      label: "Collateral Factor",
      data: formatUnits(pool.collateralFactorMantissa??"",16)+"%",
    },
    { label: `${pool.underlyingSymbol} minted`, data: formatNumber(formatUnits(pool.totalSupplyMantissa??"",6)) },

    { label: "Exchange rate", data: "1"+ pool.underlyingSymbol +"="+ getExchangeRate(pool.exchangeRateMantissa??"",8,pool.underlyingDecimal) +" v"+ pool.underlyingSymbol },

  ];
  useEffect(() => {
    // Fetch data from API
    async function fetchhistory() {
      setLoading(true);
      const response = await axios.get(
        "https://api.venus.io/markets/history",
        {
          params: {
            asset: id,
          },
        }
      );
      const { data } = response.data.result;
      let chartData: any = [];
      data.forEach((item: any, index: number) => {
        chartData.push({
          name: index + 1,
          val: item.totalSupplyCents,
        });
      });
      setHistory(chartData);
      setLoading(false);
    }
    async function fetchpool() {
      setLoading(true);
      const response = await axios.get(
        "https://api.venus.io/markets/core-pool",
        {
          params: {
            address: id,
          },
        }
      );
      response.data.result.map((pool: any) => {
        const totalsupply = decodeMantissa(pool.totalSupplyMantissa, 8, 0);
        const exchangeRate = decodeMantissa(pool.exchangeRateMantissa, 8, 18);
        pool.totalsupplyusd =
          totalsupply * exchangeRate * Number(pool.tokenPriceCents);
        return pool;
      });
      response.data.result.sort(
        (a: any, b: any) => Number(b.liquidityCents) - Number(a.liquidityCents)
      );
      response.data.result.forEach((item: any) => {
        item.logo = getImage(item.name);
      });
      setPool(response.data.result[0]);
      setLoading(false);
    }
    fetchpool();
    fetchhistory();
  }, [id]);
  console.log(pool);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full py-8 px-10">
      <div className="flex justify-between mb-4">
        <Chip>{pool.name}</Chip>
        <ConnectButton />
      </div>
      <div className="flex flex-row justify-between">
        <div className="w-2/3">
          <AreaChartComponent data={history} />
        </div>
        <div className="w-1/4 flex flex-col gap-6">
          <Card className="bg-[#1E2431] p-3">
            <CardBody className="flex flex-row justify-between text-md text-center items-center text-white">
              <button
                onClick={() => {
                  setSelectedTab("supply");
                  onOpen();
                }}
                className="h-12 py-2 px-6 rounded-lg bg-blue-600"
              >
                Supply
              </button>
              <button
                onClick={() => {
                  setSelectedTab("borrow");
                  onOpen();
                }}
                className="h-12 py-2 px-6 rounded-lg border border-blue-600"
              >
                Borrow
              </button>
              <SupplyModal
                pool={pool}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                poolType="core"
              />
            </CardBody>
          </Card>
          <Card className="w-full bg-[#1E2431] p-6">
            <CardHeader className="font-bold text-lg p-0 mb-4 text-white">
              Market Info
            </CardHeader>
            <CardBody className="px-0">
              {totalData? poolInfo.map((info, index) => (
                <div key={index} className="">
                  <Divider />
                  <div className="py-3 flex justify-between">
                    <p className="text-gray-500">{info.label}</p>
                    <p className="text-white">
                      {info.data ? info.data: ""}
                    </p>
                  </div>
                </div>
              )):null}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoolComponent;
