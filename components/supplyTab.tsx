"use client";
import { useState } from "react";
import Image from "next/image";
import { Switch, Input, Button, Divider } from "@nextui-org/react";
import { getExchangeRate } from "@/app/utils/formatNumber";
import { formatUnits, parseUnits } from "viem";
import { useWaitForTransaction } from "wagmi";
// import CoinSearch from "./coinSearch";
// import getImage from "./abi/tokenImage";

function SupplyTab({
  pool,
  id,
  mint,
  approve,
  mintBNB,
  marketHandler,
  Membership,
  vtokenbalance,
  underlyingbalance,
  accountLiquidity,
  borrowBalance,
  isConnected,
  allowance,
  refetchbalance,
}: any) {
  const [amount, setAmount] = useState(0);
  // const [openSeach, setOpenSearch] = useState(false);
  // const [coin, setCoin] = useState({ name: pool.name, symbol: pool.name });

  const handlesupplysubmit = async (e: any) => {
    e.preventDefault();
    if (allowance.data < parseUnits(String(amount), pool.underlyingDecimal)) {
      return;
    }
    if (pool.underlyingSymbol === "BNB") {
      mintBNB({ value: parseUnits(amount.toString(), 18) });
    } else {
      mint({
        args: [parseUnits(amount.toString(), pool.underlyingDecimal)],
      });
    }
    refetchbalance();
  };
  const handleApprove = async (e: any) => {
    e.preventDefault();
    approve({
      args: [id, parseUnits(amount.toString(), pool.underlyingDecimal)],
    }).then(() => {
      refetchbalance();
      allowance.refetch();
    });
  };
  const progress =
    ((Number(formatUnits(borrowBalance ?? "", pool.underlyingDecimal)) *
      Number(pool.tokenPriceCents)) /
      100 /
      Number(formatUnits(accountLiquidity ? accountLiquidity[1] : "", 18))) *
    100;
  return (
    <form
      className="flex flex-col gap-3 items-center text-white"
      onSubmit={handlesupplysubmit}
    >
      <div className="w-full flex justify-between">
        <p className="text-gray-400">Collateral</p>
        <Switch
          isSelected={Membership}
          onClick={() => marketHandler()}
        ></Switch>
      </div>
      <Input
        placeholder="0.00"
        variant="bordered"
        type="number"
        value={String(amount)}
        onChange={(e) => {
          if (Number(e.target.value) > 0) {
            setAmount(Number(e.target.value));
          } else {
            setAmount(0);
          }
        }}
        startContent={
          <Image src={pool.logo} alt="logo" width={20} height={20} />
        }
        endContent={
          <div className="flex gap-2">
            {/* <Button
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
            )} */}
            <Button
              size="sm"
              onClick={() => {
                setAmount(Number(underlyingbalance?.formatted));
              }}
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
          {vtokenbalance != undefined ? (
            <p>{`${Number(underlyingbalance?.formatted).toFixed(4)} ${
              pool.underlyingSymbol
            }`}</p>
          ) : (
            <p>0.00</p>
          )}
        </div>
        <Divider className="my-4 bg-gray-600" />
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={pool.logo} alt="logo" width={20} height={20} />
            <p className="text-gray-400">Supply APY</p>
          </div>

          <p>{Number(pool.supplyApy).toFixed(3)}%</p>
        </div>
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={pool.logo} alt="logo" width={20} height={20} />
            <p className="text-gray-400">Distribution APY (XVS)</p>
          </div>
          <p>{Number(pool.supplyXvsApy).toFixed(3)}%</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Total APY</p>
          <p>
            {(Number(pool.supplyXvsApy) + Number(pool.supplyApy)).toFixed(3)}%
          </p>
        </div>
        <Divider className="my-4 bg-gray-600" />
        <div className="flex justify-between">
          <p className="text-gray-400">{`Current : $${(
            (Number(formatUnits(borrowBalance ?? "", pool.underlyingDecimal)) *
              Number(pool.tokenPriceCents)) /
            100
          ).toFixed(3)}`}</p>
          <p>
            Max $
            {Number(
              formatUnits(accountLiquidity ? accountLiquidity[1] : "", 18)
            ).toFixed(3)}
          </p>
        </div>
        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className={`${
              progress > 85 ? "bg-red-600" : "bg-green-600"
            } h-2.5 absolute rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
          <div
            className="bg-red-600 h-2.5 dark:bg-blue-500 absolute w-1"
            style={{ left: "85%" }}
          ></div>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">{`Supply Balance (${pool.underlyingSymbol})`}</p>

          {vtokenbalance != undefined ? (
            amount === 0 ? (
              <p>
                {(
                  Number(vtokenbalance?.formatted) /
                  Number(
                    getExchangeRate(
                      pool.exchangeRateMantissa,
                      8,
                      pool.underlyingDecimal
                    )
                  )
                ).toFixed(6)}
              </p>
            ) : (
              <>
                <p>
                  {(
                    Number(vtokenbalance?.formatted) /
                      Number(
                        getExchangeRate(
                          pool.exchangeRateMantissa,
                          8,
                          pool.underlyingDecimal
                        )
                      ) +
                    Number(amount)
                  ).toFixed(6)}
                </p>
              </>
            )
          ) : (
            <p>0.00</p>
          )}
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Borrow limit</p>
          <p>
            {Number(
              formatUnits(accountLiquidity ? accountLiquidity[1] : "", 18)
            ).toFixed(3)}
          </p>
        </div>
        {/* <div className="flex justify-between">
          <p className="text-gray-400">Daily earnings</p>
          <p>0.02%</p>
        </div> */}
      </div>
      {isConnected ? (
        Number(allowance.data) <
          Number(parseUnits(String(amount), pool.underlyingDecimal)) ||
        pool.underlyingSymbol == "BNB" ? (
          <Button
            variant="bordered"
            color="primary"
            className="w-full"
            type="submit"
            onClick={(e: any) => handleApprove(e)}
          >
            Approve
          </Button>
        ) : (
          <Button
            variant="solid"
            color="primary"
            className="w-full"
            type="submit"
            onClick={(e: any) => handlesupplysubmit(e)}
          >
            Supply
          </Button>
        )
      ) : (
        <Button
          variant="bordered"
          color="primary"
          className="w-full"
          type="submit"
          disabled
        >
          Connect Wallet
        </Button>
      )}
    </form>
  );
}

export default SupplyTab;
