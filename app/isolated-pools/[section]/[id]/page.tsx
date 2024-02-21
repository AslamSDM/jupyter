"use client";
import { useParams } from "next/navigation";
import useHistory from "@/hooks/useHistory";
import { MoonLoader } from "react-spinners";
import { useEffect, useState, useCallback, use } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip, Divider, useDisclosure } from "@nextui-org/react";
import AreaChartComponent from "@/components/charts/Areachart";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SupplyModal from "@/components/isolatedsupplyModal";
import { formatNumber, getExchangeRate, getRate } from "@/app/utils/formatNumber";
import { formatUnits } from "viem";
import { bsc } from "viem/chains";
import { createPublicClient, http } from "viem";
import { oracleabi } from "@/components/abi/oracleabi";
import { vTokenabi } from "@/components/abi/vTokenabi";

const bscClient = createPublicClient({
    chain: bsc,
    transport: http()
  })

const PoolComponent = () => {
  const { section,id } = useParams();
  const [pool, setPool] = useState<any>([]);
  const [comptroller, setComptroller] = useState<any>([]);
  const [supplyHistory, setSupplyHistory] = useState<any>([]);
  const [borrowHistory, setBorrowHistory] = useState<any>([]);
  const [lineChartData, setLineChartData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState<any>("supply");
  // const { history, loading } = useHistory(id.toString());

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
 const [priceData, setPriceData] = useState({
    "0x0": { price: 1, decimal: 18 },
  });
  const [totalSupply, setTotalSupply] = useState({
    supply:0,
    borrow:0
  });
  useEffect(() => {

  }, [section]);
  // console.log({pool});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch("/api/isolatedpools?chain=bsc");
      const data = await res.json();
      const pools_json = JSON.parse(data);
      const pool_ = pools_json.filter((pool: any) => pool.name === section);
      const vTokens = pool_.flatMap((p: any) => p.vTokens);
      const vToken = vTokens.filter((vToken: any) => vToken.vToken == id);
      const price =  await bscClient.readContract({
        address: pool_[0].priceOracle,
        abi: oracleabi,
        functionName: "getUnderlyingPrice",
        args: [vToken[0].vToken],
    })
    const VtokenContract = {
      address:vToken[0].vToken,
      abi:vTokenabi
    }
    const usymbol = await bscClient.readContract({
      address:vToken[0].underlyingAssetAddress,
      abi:vTokenabi,
      functionName:"symbol"
    })
    // const supplyrate = await bscClient.readContract({
    //   address:vToken[0].vToken,
    //   abi:vTokenabi,
    //   functionName:"supplyRatePerBlock",
    // })
    // const borrowrate = await bscClient.readContract({
    //   address:vToken[0].vToken,
    //   abi:vTokenabi,
    //   functionName:"borrowRatePerBlock",
    // })
    // console.log(borrowrate);
    // console.log(vToken[0].borrowRatePerBlock,vToken[0].underlyingDecimals);
    vToken[0]["tokenPriceCents"] = formatUnits(price as bigint??"", vToken[0].underlyingDecimals);
    vToken[0]["underlyingSymbol"] = usymbol;
    vToken[0]["underlyingDecimal"] = Number(vToken[0].underlyingDecimals);
    vToken[0]["underlyingAddress"] = vToken[0].underlyingAssetAddress;
    vToken[0]["exchangeRateMantissa"] = vToken[0].exchangeRateCurrent;
    vToken[0]["borrowApy"] = getRate(vToken[0].borrowRatePerBlock as string??"",Number(vToken[0].underlyingDecimals));
    vToken[0]["supplyApy"] = getRate(vToken[0].supplyRatePerBlock as string??"",Number(vToken[0].underlyingDecimals));
      setComptroller(pool_[0]);
      setPool(vToken[0]);
      setLoading(false);
    }
    async function fetchhistory() {
      const response = await axios.get("https://api.venus.io/markets/history", {
        params: {
          asset: id,
        },
      });
      const { data } = response.data.result;
      let supplyChartData: any = [];
      let borrowChartData: any = [];
      let lineChartData: any = [];
      const data_len = data.length;
      data.forEach((item: any,index:number) => {
        const date = new Date(item.blockTimestamp * 1000).toLocaleDateString(
          "en-GB"
        );
        const supplyApy = item.supplyApy;
        const totalSupply = formatNumber(item.totalSupplyCents);
        const borrowApy = item.borrowApy;
        const totalBorrow = formatNumber(item.totalBorrowCents);
        lineChartData.push({
          supplyApy: supplyApy,
          borrowApy: borrowApy,
          utilizationRate: (index/360)*100,
          
        });
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
      setLineChartData(lineChartData);
    }
    setLoading(true);
    fetchhistory();
    fetchData();
    setLoading(false);

  }, [id,pool,comptroller]);
  const poolInfo = [
    { label: "Token Price", data: formatNumber(pool.tokenPriceCents) },
    // {
    //   label: "Market Liquidity",
    //   data: formatNumber(Number(totalData.totalLiquidity)?.toString()),
    // },
    { label: "Supply APY", data: (pool.supplyApy)?.toFixed(2)<0.01?"<0.01%":(pool.supplyApy)?.toFixed(2)+ "%" },
    { label: "Borrow APY", data: (pool.borrowApy)?.toFixed(2)<0.01?"<0.01%":(pool.borrowApy)?.toFixed(2)+ "%" },
    {
      label: "Supply Cap",
      data:
        formatNumber(
          formatUnits(pool.supplyCaps ?? "", pool.underlyingDecimals - 2)
        ) +
        " " +
        pool.underlyingSymbol,
    },
    {
      label: "Borrow Cap",
      data:
        formatNumber(
          formatUnits(pool.borrowCaps ?? "", pool.underlyingDecimals - 2)
        ) +
        " " +
        pool.underlyingSymbol,
    },
    // {
    //   label: "Daily supplying interests",
    //   data: "pool",
    // },
    // { label: "Daily borrowing interests", data: Number(getDailyRate(pool.borrowRatePerBlock,pool.underlyingDecimal))*pool.totalsupplyusd },
    // { label: "Daily XVS distributed", data: "pool" },
    {
      label: "Reserves",
      data:
        Number(
          formatUnits(pool.totalReserves ?? "", pool.underlyingDecimals)
        ).toFixed(4) +
        " " +
        pool.underlyingSymbol,
    },
    {
      label: "Reserve Factor",
      data: formatUnits(pool.reserveFactorMantissa ?? "", 16) + "%",
    },
    {
      label: "Collateral Factor",
      data: formatUnits(pool.collateralFactorMantissa ?? "", 16) + "%",
    },
    {
      label: `${pool.underlyingSymbol} minted`,
      data: formatNumber(formatUnits(pool.totalSupply ?? "", 6)),
    },

    {
      label: "Exchange rate",
      data:
        "1" +
        pool.underlyingSymbol +
        "=" +
        getExchangeRate(
          pool.exchangeRateCurrent ?? "",
          8,
          pool.underlyingDecimals
        ) +
        " v" +
        pool.underlyingSymbol,
    },
  ];

  if (loading) {
    return (
      <>
        <div className="flex flex-col w-full items-center justify-center h-screen gap-4 ">
          <MoonLoader color="#ffffff" />
          Loading
        </div>
      </>
    );
  }

  return (
    <div className="w-full py-8 px-10">
      <div className="flex justify-between mb-4">
      <h2 className="text-xl text-gray-400 font-bold">
          Isolated pools /{section}/ <span className="text-white">{pool. underlyingSymbol
}</span>
        </h2>
                <ConnectButton />
      </div>
      <div className="flex flex-row justify-between">
      <div className="w-2/3 space-y-8">

      <div className="w-full bg-[#1E2431] rounded-xl p-8 space-y-8">
            <h2 className="text-3xl font-semibold text-white">Supply Info</h2>
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
            <AreaChartComponent
              data={borrowHistory}
              yFieldLabel="Borrow APY"
              yFieldName="borrowApy"
              color="#E93D66"
              tooltipFieldName="totalBorrow"
              tooltipFieldLabel="Total Borrow"
            />
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
                poolType="isolated"
              />
            </CardBody>
          </Card>
          <Card className="w-full bg-[#1E2431] p-6">
            <CardHeader className="font-bold text-lg p-0 mb-4 text-white">
              Market Info
            </CardHeader>
            <CardBody className="px-0">
              {poolInfo.map((info, index) => (
                <div key={index} className="">
                  <Divider />
                  <div className="py-3 flex justify-between">
                    <p className="text-gray-500">{info.label}</p>
                    <p className="text-white">
                      {info.data ? info.data : ""}
                    </p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoolComponent;
