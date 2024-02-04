"use client";
import { useState } from "react";
import Image from "next/image";
import { Switch, Input, Button, Divider } from "@nextui-org/react";
import { ethers } from "ethers";
import CoinSearch from "./coinSearch";
import getImage from "./abi/tokenImage";

function SupplyTab({ pool, id, mint, approve, mintBNB ,marketHandler,Membership}: any) {
  const [amount, setAmount] = useState(0);
  const [openSeach, setOpenSearch] = useState(false);
  const [coin, setCoin] = useState({ name: pool.name, symbol: pool.name });

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
        <Switch isSelected={Membership} onClick={()=>marketHandler()}></Switch>
      </div>
      <Input
        placeholder="0.00"
        variant="bordered"
        type="number"
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
        startContent={
          <Image src={pool.logo} alt="logo" width={20} height={20} />
        }
        endContent={
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setOpenSearch(!openSeach)}
              className="bg-[#2D3549] text-white"
            >
              <Image
                src={getImage("Venus " + coin.symbol)}
                alt="logo"
                width={20}
                height={20}
              />
              {coin.symbol}
              <svg
                fill="#FFFF"
                height="200px"
                width="200px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 330 330"
                xmlSpace="preserve"
                stroke="#FFFF"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    id="XMLID_225_"
                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                  ></path>{" "}
                </g>
              </svg>
            </Button>
            {openSeach && (
              <CoinSearch setCoin={setCoin} setOpenSearch={setOpenSearch} />
            )}
            <Button
              size="sm"
              onClick={() => {}}
              className="bg-[#2D3549] text-white"
            >
              Max
            </Button>
          </div>
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
            <Image src={pool.logo} alt="logo" width={20} height={20} />
            <p className="text-gray-400">Supply APY</p>
          </div>
          <p>0.02%</p>
        </div>
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={pool.logo} alt="logo" width={20} height={20} />
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
