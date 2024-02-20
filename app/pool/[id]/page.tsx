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
import { formatNumber } from "@/app/utils/formatNumber";
import LineChartComponent from "@/components/charts/Linechart";

const PoolComponent = () => {
  const { id } = useParams();
  const [pool, setPool] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any>([]);
  const [supplyHistory, setSupplyHistory] = useState<any>([]);
  const [borrowHistory, setBorrowHistory] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState<any>("supply");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const poolInfo = [
    { label: "Token Price", data: pool.tokenPriceCents / 100 },
    { label: "Market Liquidity", data: "" },
    { label: "APY", data: Number(pool.supplyApy) + Number(pool.supplyXvsApy) },
    { label: "APR", data: pool.supplyApr },
    { label: "TVL", data: pool.supplyBalance },
    { label: "Address", data: pool.address },
    { label: "Borrow APY", data: pool.borrowApy },
    { label: "Borrow Caps Mantissa", data: pool.borrowCapsMantissa },
    { label: "Borrow Rate Per Block", data: pool.borrowRatePerBlock },
    { label: "Borrow Xvs APR", data: pool.borrowXvsApr },
    { label: "Borrow Xvs APY", data: pool.borrowXvsApy },
    { label: "Borrower Count", data: pool.borrowerCount },
    {
      label: "Borrower Daily Xvs Mantissa",
      data: pool.borrowerDailyXvsMantissa,
    },
    { label: "Cash Mantissa", data: pool.cashMantissa },
    {
      label: "Collateral Factor Mantissa",
      data: pool.collateralFactorMantissa,
    },
    { label: "Exchange Rate Mantissa", data: pool.exchangeRateMantissa },
    {
      label: "Last Calculated Xvs Accrued Block Number",
      data: pool.lastCalculatedXvsAccruedBlockNumber,
    },
    { label: "Liquidity Cents", data: pool.liquidityCents },
    { label: "Reserve Factor Mantissa", data: pool.reserveFactorMantissa },
    { label: "Supplier Count", data: pool.supplierCount },
    {
      label: "Supplier Daily Xvs Mantissa",
      data: pool.supplierDailyXvsMantissa,
    },
    { label: "Supply APY", data: pool.supplyApy },
    { label: "Supply Caps Mantissa", data: pool.supplyCapsMantissa },
    { label: "Supply Rate Per Block", data: pool.supplyRatePerBlock },
    { label: "Supply Xvs APR", data: pool.supplyXvsApr },
    { label: "Supply Xvs APY", data: Number(pool.supplyXvsApy).toFixed(10) },
    { label: "Total Borrows Mantissa", data: pool.totalBorrowsMantissa },
    {
      label: "Total Distributed Mantissa",
      data: pool.totalDistributedMantissa,
    },
    { label: "Total Reserves Mantissa", data: pool.totalReservesMantissa },
    { label: "Total Supply Mantissa", data: pool.totalSupplyMantissa },
    { label: "Underlying Address", data: pool.underlyingAddress },
    { label: "Underlying Decimal", data: pool.underlyingDecimal },
    { label: "Underlying Name", data: pool.underlyingName },
    { label: "Underlying Price Mantissa", data: pool.underlyingPriceMantissa },
    { label: "Xvs Borrow Index", data: pool.xvsBorrowIndex },
    { label: "Xvs Supply Index", data: pool.xvsSupplyIndex },
  ];
  useEffect(() => {
    // Fetch data from API
    async function fetchhistory() {
      setLoading(true);
      const response = await axios.get("https://api.venus.io/markets/history", {
        params: {
          asset: id,
        },
      });
      const { data } = response.data.result;
      console.log(response);
      let supplyChartData: any = [];
      let borrowChartData: any = [];
      data.forEach((item: any) => {
        const date = new Date(item.blockTimestamp * 1000).toLocaleDateString(
          "en-GB"
        );
        const supplyApy = item.supplyApy;
        const totalSupply = formatNumber(item.totalSupplyCents);
        const borrowApy = item.borrowApy;
        const totalBorrow = formatNumber(item.totalBorrowCents);
        supplyChartData.push({
          date: date,
          supplyApy: supplyApy,
          totalSupply: totalSupply,
        });
        borrowChartData.push({
          date: date,
          borrowApy: borrowApy,
          totalBorrow: totalBorrow,
        });
      });
      setSupplyHistory(supplyChartData);
      setBorrowHistory(borrowChartData);
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
      <div className="flex flex-row justify-between items-start">
        <div className="w-2/3 space-y-8">
          <div className="w-full bg-[#1E2431] rounded-xl p-8 space-y-8">
            <h2 className="text-3xl font-semibold text-white">Supply Info</h2>
            <ul className="flex gap-8 items-center">
              <li className="flex flex-col gap-2">
                <p className="text-gray-300">Total Supply</p>
                <p className="text-white">{`$516.33M`}</p>
              </li>
              <div className="w-px h-12 bg-gray-500"></div>
              <li className="flex flex-col gap-2">
                <p className="text-gray-300">APY</p>
                <p className="text-white">{`0.02%`}</p>
              </li>
              <div className="w-px h-12 bg-gray-500"></div>
              <li className="flex flex-col gap-2">
                <p className="text-gray-300">Distribution APY</p>
                <p className="text-white">{`0.02%`}</p>
              </li>
            </ul>
            <AreaChartComponent
              data={supplyHistory}
              yFieldLabel="Supply APY"
              yFieldName="supplyApy"
              color="#4ADE80"
              tooltipFieldName="totalSupply"
              tooltipFieldLabel="Total Supply"
            />
          </div>
          <div className="w-full bg-[#1E2431] rounded-xl p-8 space-y-8">
            <h2 className="text-3xl font-semibold text-white">Borrow Info</h2>
            <ul className="flex gap-8 items-center">
              <li className="flex flex-col gap-2">
                <p className="text-gray-300">Total Borrow</p>
                <p className="text-white">{`$516.33M`}</p>
              </li>
              <div className="w-px h-12 bg-gray-500"></div>
              <li className="flex flex-col gap-2">
                <p className="text-gray-300">APY</p>
                <p className="text-white">{`0.02%`}</p>
              </li>
              <div className="w-px h-12 bg-gray-500"></div>
              <li className="flex flex-col gap-2">
                <p className="text-gray-300">Distribution APY</p>
                <p className="text-white">{`0.02%`}</p>
              </li>
            </ul>
            <AreaChartComponent
              data={borrowHistory}
              yFieldLabel="Borrow APY"
              yFieldName="borrowApy"
              color="#E93D66"
              tooltipFieldName="totalBorrow"
              tooltipFieldLabel="Total Borrow"
            />
          </div>
          <div className="w-full bg-[#1E2431] rounded-xl p-8 space-y-8">
            <h2 className="text-3xl font-semibold text-white">
              Interest Rate Model
            </h2>
            <LineChartComponent />
          </div>
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
              {poolInfo.map((info, index) => (
                <ul key={index} className="">
                  <Divider />
                  <li className="py-3 flex justify-between">
                    <p className="text-gray-500">{info.label}</p>
                    <p className="text-white">
                      {info.data ? info.data.toString().substring(0, 5) : ""}
                    </p>
                  </li>
                </ul>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoolComponent;
