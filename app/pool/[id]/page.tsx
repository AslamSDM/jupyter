"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  Button,
  Chip,
  Divider,
  Input,
  Tab,
  Tabs,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Progress,
} from "@nextui-org/react";
import {} from "@nextui-org/react";
import { useContractRead, useContractWrite, useSendTransaction } from "wagmi";
import { vTokenabi } from "@/components/abi/vTokenabi";
import { vBNBTokenabi } from "@/components/abi/vBNBTokenabi";
import { ethers } from "ethers";
import { Console } from "console";
import AreaChartComponent from "@/components/charts/Areachart";
import Logo from "@/assets/logo.svg";

const PoolComponent = () => {
  const { id } = useParams();
  const [pool, setpool] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [history, setHistory] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState<any>("supply");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  const poolInfo = [
    { label: "Token Price", data: pool.tokenPriceCents },
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
      const response = await axios.get(
        "https://testnetapi.venus.io/markets/history",
        {
          params: {
            asset: id,
          },
        }
      );
      setHistory(response.data.result);
      console.log(response.data.result);
      setLoading(false);
    }
    async function fetchpool() {
      setLoading(true);
      const response = await axios.get(
        "https://testnetapi.venus.io/markets/core-pool",
        {
          params: {
            address: id,
          },
        }
      );
      response.data.result.sort(
        (a: any, b: any) => Number(b.liquidityCents) - Number(a.liquidityCents)
      );
      setpool(response.data.result[0]);
      setLoading(false);
    }
    fetchpool();
    fetchhistory();
  }, []);
  const totalsupply = decodeMantissa(pool.totalSupplyMantissa, 8, 0);
  const exchangeRate = decodeMantissa(pool.exchangeRateMantissa, 8, 18);
  const totalsupplyusd =
    totalsupply * exchangeRate * Number(pool.tokenPriceCents);

  const { write: mint } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "mint",
  });
  const { write: mintBNB } = useContractWrite({
    address: id as `0x${string}`,
    abi: vBNBTokenabi,
    functionName: "mint",
  });

  const { write: approve } = useContractWrite({
    address: pool.underlyingAddress as `0x${string}`,
    abi: vTokenabi,
    functionName: "approve",
  });
  const { data: allowance } = useContractRead({
    address: pool.underlyingAddress as `0x${string}`,
    abi: vTokenabi,
    functionName: "allowance",
  });
  const { write: approveVtoken } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "approve",
  });
  const { write: borrow } = useContractWrite({
    address: id as `0x${string}`,
    abi: vBNBTokenabi,
    functionName: "borrow",
  });
  const { write: redeem } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "redeemUnderlying",
  });
  const { write: repay } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "repayBorrow",
  });

  const handlesupplysubmit = async (e: any) => {
    e.preventDefault();
    if (pool.underlyingSymbol === "BNB") {
      mintBNB({ value: ethers.parseUnits(amount.toString(), 18) });
    } else {
      approve({
        args: [
          id,
          ethers.parseUnits(amount.toString(), pool.underlyingDecimal),
        ],
      });
      mint({
        args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)],
      });
    }
  };
  const handleborrowsubmit = async (e: any) => {
    e.preventDefault();
    console.log(amount);
    if (pool.underlyingSymbol === "BNB") {
      borrow({
        args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)],
      });
    } else {
      borrow({
        args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)],
      });
    }
  };
  const handlewithdrawsubmit = async (e: any) => {
    e.preventDefault();
    approveVtoken({ args: [id, ethers.parseUnits(amount.toString(), 8)] });
    redeem({
      args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)],
    });
  };
  const handleRepay = async (e: any) => {
    e.preventDefault();
    approve({
      args: [id, ethers.parseUnits(amount.toString(), pool.underlyingDecimal)],
    });
    repay({
      args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)],
    });
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" w-full py-8 px-10">
      <Chip>{pool.name}</Chip>
      <div className="flex flex-row justify-between">
        <div className="w-2/3">
          <AreaChartComponent data={history} />
        </div>
        <div className="w-1/4 flex flex-col gap-6">
          <Card className="bg-[#1E2431] p-3">
            <CardBody className="flex flex-row justify-between text-md text-center items-center">
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
              <Modal isOpen={isOpen} onClose={onOpenChange}>
                <ModalContent className="items-center bg-[#1E2431]">
                  <ModalHeader className="text-center">{pool.name}</ModalHeader>
                  <Divider />
                  <ModalBody className="w-full items-center">
                    <Tabs
                      selectedKey={selectedTab}
                      onSelectionChange={setSelectedTab}
                      variant="light"
                      size="lg"
                      color="primary"
                    >
                      <Tab key="supply" className="w-full" title="Supply">
                        <Card>
                          <CardBody className="bg-[#1E2431]">
                            <form
                              className="flex flex-col gap-3 items-start"
                              onSubmit={handlesupplysubmit}
                            >
                              <Input
                                placeholder="Amount"
                                variant="bordered"
                                type="number"
                                onChange={(e) => {
                                  setAmount(Number(e.target.value));
                                }}
                              />
                              <Button type="submit">Supply</Button>
                            </form>
                          </CardBody>
                        </Card>
                      </Tab>
                      <Tab key="borrow" className="w-full" title="Borrow">
                        <Card>
                          <CardBody className="bg-[#1E2431]">
                            <form
                              className="flex flex-col gap-3 items-start"
                              onSubmit={handleborrowsubmit}
                            >
                              <Input
                                placeholder="Amount"
                                type="number"
                                onChange={(e) => {
                                  setAmount(Number(e.target.value));
                                }}
                              />
                              <Button type="submit">Borrow</Button>
                            </form>
                          </CardBody>
                        </Card>
                      </Tab>
                      <Tab key="withdraw" className="w-full" title="Withdraw">
                        <Card>
                          <CardBody className="bg-[#1E2431]">
                            <form
                              className="flex flex-col gap-3 items-center"
                              onSubmit={handlewithdrawsubmit}
                            >
                              <Input
                                placeholder="0.00"
                                variant="bordered"
                                type="number"
                                onChange={(e) => {
                                  setAmount(Number(e.target.value));
                                }}
                                startContent={
                                  <Image
                                    src={Logo}
                                    alt="logo"
                                    width={20}
                                    height={20}
                                  />
                                }
                                endContent={
                                  <Button size="sm" onClick={() => {}}>
                                    Max
                                  </Button>
                                }
                              />
                              <div className="flex flex-col w-full gap-2">
                                <div className="flex justify-between">
                                  <p>Withdrawable amount</p>
                                  <p>0 BTCB</p>
                                </div>
                                <Divider className="my-4" />
                                <div className="flex justify-between">
                                  <div className="flex justify-start gap-1">
                                    <Image
                                      src={Logo}
                                      alt="logo"
                                      width={20}
                                      height={20}
                                    />
                                    <p>Supply APY</p>
                                  </div>
                                  <p>0.02%</p>
                                </div>
                                <div className="flex justify-between">
                                  <div className="flex justify-start gap-1">
                                    <Image
                                      src={Logo}
                                      alt="logo"
                                      width={20}
                                      height={20}
                                    />
                                    <p>Distribution APY</p>
                                  </div>
                                  <p>0.02%</p>
                                </div>
                                <div className="flex justify-between">
                                  <p>Supply APY</p>
                                  <p>0.02%</p>
                                </div>
                                <Divider className="my-4" />
                                <Progress
                                  label="Current"
                                  value={50}
                                  maxValue={200}
                                  showValueLabel={true}
                                  formatOptions={{
                                    style: "currency",
                                    currency: "USD",
                                    currencyDisplay: "symbol",
                                  }}
                                  classNames={{
                                    label: "text-gray-500",
                                  }}
                                />
                                <div className="flex justify-between">
                                  <p>Supply Balance</p>
                                  <p>0.02%</p>
                                </div>
                                <div className="flex justify-between">
                                  <p>Borrow limit</p>
                                  <p>0.02%</p>
                                </div>
                                <div className="flex justify-between">
                                  <p>Daily earnings</p>
                                  <p>0.02%</p>
                                </div>
                              </div>
                              <Button variant="bordered" type="submit">Withdraw</Button>
                            </form>
                          </CardBody>
                        </Card>
                      </Tab>
                      <Tab key="repay" className="w-full" title="Repay">
                        <Card>
                          <CardBody className="bg-[#1E2431]">
                            <form
                              className="flex flex-col gap-3 items-start"
                              onSubmit={handleRepay}
                            >
                              <Input
                                placeholder="Amount"
                                type="number"
                                onChange={(e) => {
                                  setAmount(Number(e.target.value));
                                }}
                              />
                              <Button type="submit">Repay</Button>
                            </form>
                          </CardBody>
                        </Card>
                      </Tab>
                    </Tabs>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </CardBody>
          </Card>
          <Card className="w-full bg-[#1E2431] p-6">
            <CardHeader className="font-bold text-lg p-0 mb-4">
              Market Info
            </CardHeader>
            <CardBody className="px-0">
              {poolInfo.map((info, index) => (
                <div key={index} className="">
                  <Divider />
                  <div className="py-3 flex justify-between">
                    <p className="text-gray-500">{info.label}</p>
                    <p className="text-white">
                      {info.data ? info.data.toString().substring(0, 5) : ""}
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
