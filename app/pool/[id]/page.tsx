"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody } from "@nextui-org/card";
import { Button, Chip, Input, Tab, Tabs } from "@nextui-org/react";
import { useContractRead, useContractWrite, useSendTransaction } from "wagmi";
import { vTokenabi } from "@/components/abi/vTokenabi";
import { vBNBTokenabi } from "@/components/abi/vBNBTokenabi";
import { ethers } from "ethers";
import { Console } from "console";
import AreaChartComponent from "@/components/charts/Areachart";
const PoolComponent = () => {
  const { id } = useParams();
  const [pool, setpool] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [history, setHistory] = useState<any>([]);
  function decodeMantissa(mantissa: string, vdecimals: number,udecimals: number): number {
    const value = Number(mantissa);

    const decimals = 18 + udecimals- vdecimals
    const f = value / Math.pow(10, decimals);
    return Number(f);
}
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
        console.log(response.data.result)
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
    const totalsupply = decodeMantissa(pool.totalSupplyMantissa,8, 0)
    const exchangeRate = decodeMantissa(pool.exchangeRateMantissa,8, 18)
    const totalsupplyusd = totalsupply*exchangeRate*Number(pool.tokenPriceCents)

const {write:mint} = useContractWrite({
  address: id as `0x${string}`,
  abi: vTokenabi,
  functionName: 'mint',
})
const {write:mintBNB} = useContractWrite({
  address: id as `0x${string}`,
  abi: vBNBTokenabi,
  functionName: 'mint',
})

const {write:approve} = useContractWrite({
  address: pool.underlyingAddress as `0x${string}` ,
  abi: vTokenabi,
  functionName: 'approve',
})
const {data:allowance} = useContractRead({
  address: pool.underlyingAddress as `0x${string}` ,
  abi: vTokenabi,
  functionName: 'allowance',
})
const {write:approveVtoken} = useContractWrite({
  address: id as `0x${string}` ,
  abi: vTokenabi,
  functionName: 'approve',
})
const {write:borrow} = useContractWrite({
  address: id as `0x${string}`,
  abi: vBNBTokenabi,
  functionName: 'borrow',
})
const {write:redeem} = useContractWrite({
  address: id as `0x${string}`,
  abi: vTokenabi,
  functionName: 'redeemUnderlying',
})
const {write:repay} = useContractWrite({
  address: id as `0x${string}`,
  abi: vTokenabi,
  functionName: 'repayBorrow',
})

const handlesupplysubmit = async (e: any) => {
    e.preventDefault();
    if(pool.underlyingSymbol === 'BNB'){
    mintBNB({value: ethers.parseUnits(amount.toString(), 18)})
    }
    else{
      approve({args:[ id , ethers.parseUnits(amount.toString(), pool.underlyingDecimal)]})
      mint({args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)]})
    }
  }
  const handleborrowsubmit = async (e: any) => {
    e.preventDefault();
    console.log(amount)
    if(pool.underlyingSymbol === 'BNB'){
      borrow({args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)]})
    } else {
      borrow({args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)]})
    }
  }
  const handlewithdrawsubmit = async (e: any) => {
    e.preventDefault();
    approveVtoken({args:[ id , ethers.parseUnits(amount.toString(), 8)]})
    redeem({args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)]})
  }
  const handleRepay = async (e: any) => {
    e.preventDefault();
    approve({args:[ id , ethers.parseUnits(amount.toString(), pool.underlyingDecimal)]})
    repay({args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)]})
}
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Chip>{pool.name}</Chip>
      <div className="flex flex-row justify-between">
        <AreaChartComponent />
        {/* <Card>
          <CardHeader>Supply</CardHeader>
          <CardBody>
            <div>Token Price : {pool.tokenPriceCents}</div>
            <div>APY: {Number(pool.supplyApy) + Number(pool.supplyXvsApy)}</div>
            <div>APR: {pool.supplyApr}</div>
            <div>TVL: {pool.supplyBalance}</div>
            <div>Address: {pool.address}</div>
            <div>Borrow APY: {pool.borrowApy}</div>
            <div>Borrow Caps Mantissa: {pool.borrowCapsMantissa}</div>
            <div>Borrow Rate Per Block: {pool.borrowRatePerBlock}</div>
            <div>Borrow Xvs APR: {pool.borrowXvsApr}</div>
            <div>Borrow Xvs APY: {pool.borrowXvsApy}</div>
            <div>Borrower Count: {pool.borrowerCount}</div>
            <div>
              Borrower Daily Xvs Mantissa: {pool.borrowerDailyXvsMantissa}
            </div>
            <div>Cash Mantissa: {pool.cashMantissa}</div>
            <div>
              Collateral Factor Mantissa: {pool.collateralFactorMantissa}
            </div>
            <div>Exchange Rate Mantissa: {pool.exchangeRateMantissa}</div>
            <div>
              Last Calculated Xvs Accrued Block Number:{" "}
              {pool.lastCalculatedXvsAccruedBlockNumber}
            </div>
            <div>Liquidity Cents: {pool.liquidityCents}</div>
            <div>Reserve Factor Mantissa: {pool.reserveFactorMantissa}</div>
            <div>Supplier Count: {pool.supplierCount}</div>
            <div>
              Supplier Daily Xvs Mantissa: {pool.supplierDailyXvsMantissa}
            </div>
            <div>Supply APY: {pool.supplyApy}</div>
            <div>Supply Caps Mantissa: {pool.supplyCapsMantissa}</div>
            <div>Supply Rate Per Block: {pool.supplyRatePerBlock}</div>
            <div>Supply Xvs APR: {pool.supplyXvsApr}</div>
            <div>Supply Xvs APY: {pool.supplyXvsApy}</div>
            <div>Total Borrows Mantissa: {pool.totalBorrowsMantissa}</div>
            <div>
              Total Distributed Mantissa: {pool.totalDistributedMantissa}
            </div>
            <div>Total Reserves Mantissa: {pool.totalReservesMantissa}</div>
            <div>Total Supply Mantissa: {pool.totalSupplyMantissa}</div>
            <div>Underlying Address: {pool.underlyingAddress}</div>
            <div>Underlying Decimal: {pool.underlyingDecimal}</div>
            <div>Underlying Name: {pool.underlyingName}</div>
            <div>Underlying Price Mantissa: {pool.underlyingPriceMantissa}</div>
            <div>Xvs Borrow Index: {pool.xvsBorrowIndex}</div>
            <div>Xvs Supply Index: {pool.xvsSupplyIndex}</div>
          </CardBody>
        </Card> */}
        <div>

          <Tabs color="primary">
            <Tab title="Supply">
              <Card>
                <CardBody>
                    <form onSubmit={handlesupplysubmit}>

                  <Input placeholder="Amount" type="number" onChange={(e)=>{setAmount(Number(e.target.value))}} />
                  <Button type="submit">Supply</Button>
                    </form>
                </CardBody>
              </Card>
            </Tab>
            <Tab title="Borrow">
              <Card>
                <CardBody>
                    <form onSubmit={handleborrowsubmit}>
                  <Input placeholder="Amount" type="number" onChange={(e)=>{setAmount(Number(e.target.value))}} />
                  <Button type="submit">Borrow</Button>
                    </form>
                </CardBody>
              </Card>
            </Tab>
            <Tab title="Withdraw">
              <Card>
                <CardBody>
                    <form onSubmit={handlewithdrawsubmit}>
                  <Input placeholder="Amount" type="number" onChange={(e)=>{setAmount(Number(e.target.value))}} />
                  <Button type="submit">Withdraw</Button>
                    </form>
                </CardBody>
              </Card>
            </Tab>
            <Tab title="Repay">
              <Card>
                <CardBody>
                    <form onSubmit={handleRepay}>
                  <Input placeholder="Amount" type="number" onChange={(e)=>{setAmount(Number(e.target.value))}} />
                  <Button type="submit">Repay</Button>
                    </form>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>

      </div>
    </div>
  );
};

export default PoolComponent;
