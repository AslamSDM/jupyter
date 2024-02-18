"use client";
import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Input, Button } from "@nextui-org/react";
import CoinSearch from "@/components/coinSearch";
import getImage from "@/components/abi/tokenImage";

function Page() {
  const [amount, setAmount] = useState(0);
  const [openFromCoinSearch, setOpenFromCoinSearch] = useState(false);
  const [openToCoinSearch, setOpenToCoinSearch] = useState(false);
  const [fromCoin, setFromCoin] = useState({ name: "LINK", symbol: "LINK" });
  const [toCoin, setToCoin] = useState({ name: "LINK", symbol: "LINK" });

  return (
    <div className="w-full flex flex-col items-center gap-10 px-10 py-8">
      <div className="w-full flex justify-between">
        <h2 className="text-2xl text-white font-bold">Swap</h2>
        <ConnectButton />
      </div>
      <div className="w-2/5 rounded-3xl p-10 bg-[#1E2431] flex flex-col gap-4">
        <p className="text-gray-400">From</p>
        <Input
          placeholder="0.00"
          variant="bordered"
          type="number"
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
          endContent={
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setOpenFromCoinSearch(!openFromCoinSearch)}
                className="bg-[#2D3549] text-white"
              >
                <Image
                  src={getImage("Venus " + fromCoin.symbol)}
                  alt="logo"
                  width={20}
                  height={20}
                />
                {fromCoin.symbol}
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
              {openFromCoinSearch && (
                <CoinSearch
                  setCoin={setFromCoin}
                  setOpenSearch={setOpenFromCoinSearch}
                />
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
        <div className="flex justify-between">
          <p className="text-gray-400">Wallet Balance</p>
          <p>0.00</p>
        </div>
        <p>From</p>
        <Input
          placeholder="0.00"
          variant="bordered"
          type="number"
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
          endContent={
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setOpenToCoinSearch(!openToCoinSearch)}
                className="bg-[#2D3549] text-white"
              >
                <Image
                  src={getImage("Venus " + toCoin.symbol)}
                  alt="logo"
                  width={20}
                  height={20}
                />
                {toCoin.symbol}
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
              {openToCoinSearch && (
                <CoinSearch
                  setCoin={setToCoin}
                  setOpenSearch={setOpenToCoinSearch}
                />
              )}
            </div>
          }
        />
        <div className="flex justify-between">
          <p className="text-gray-400">Wallet Balance</p>
          <p>0.00</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Slippage tolerance</p>
          <p>0.00</p>
        </div>
        <Button
          size="lg"
          className="w-full bg-[#2D3549] text-white"
          type="submit"
        >
          Enter a valid amount to Swap
        </Button>
      </div>
    </div>
  );
}

export default Page;
