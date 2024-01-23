"use client";
import { useState } from "react";
import Image from "next/image";
import Logo from "../assets/logo.svg";
import { Switch, Input, Button, Divider } from "@nextui-org/react";
import { ethers } from "ethers";

function SupplyTab({ pool, id, mint, approve, mintBNB }: any) {
  const [amount, setAmount] = useState(0);
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
  return (
    <form
      className="flex flex-col gap-3 items-center text-white"
      onSubmit={handlesupplysubmit}
    >
      <div className="w-full flex justify-between">
        <p className="text-gray-400">Collateral</p>
        <Switch></Switch>
      </div>
      <Input
        placeholder="0.00"
        variant="bordered"
        type="number"
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
        startContent={<Image src={Logo} alt="logo" width={20} height={20} />}
        endContent={
          <Button size="sm" onClick={() => {}}>
            Max
          </Button>
        }
      />
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between">
          <p className="text-gray-400">Wallet Balance</p>
          <p>{`0 ${pool.name}`}</p>
        </div>
        <Divider className="my-4 bg-gray-600" />
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={Logo} alt="logo" width={20} height={20} />
            <p className="text-gray-400">Supply APY</p>
          </div>
          <p>0.02%</p>
        </div>
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={Logo} alt="logo" width={20} height={20} />
            <p className="text-gray-400">Distribution APY (XVS)</p>
          </div>
          <p>0.02%</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Total APY</p>
          <p>0.02%</p>
        </div>
        <Divider className="my-4 bg-gray-600" />
        <div className="flex justify-between">
          <p className="text-gray-400">{`Current : $0`}</p>
          <p>Max 0.02%</p>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className="bg-red-600 h-2.5 dark:bg-blue-500 absolute w-1"
            style={{ left: "85%" }}
          ></div>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">{`Supply Balance (${pool.name})`}</p>
          <p>0.02%</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Borrow limit used</p>
          <p>0.02%</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Daily earnings</p>
          <p>0.02%</p>
        </div>
      </div>
      <Button
        variant="bordered"
        color="primary"
        className="w-full"
        type="submit"
      >
        Enter a valid amount to supply
      </Button>
    </form>
  );
}

export default SupplyTab;
