import Image from "next/image";
import { useState } from "react";
import { Input, Button, Divider } from "@nextui-org/react";
import { formatUnits, parseUnits } from "viem";
import { getExchangeRate } from "@/app/utils/formatNumber";
import getImage from "./abi/tokenImage";

function Borrowtab({   pool,
  id,
  approve,
  marketHandler,
  Membership,
  vtokenbalance,
  underlyingbalance,
  accountLiquidity,
  borrowBalance,
  isConnected,
  refetchbalance, borrow,isolated }: any) {
  const [amount, setAmount] = useState(0);
  const handleborrowsubmit = async (e: any) => {
    e.preventDefault();
    if (pool.underlyingSymbol === "BNB") {
      borrow({
        args: [parseUnits(amount.toString(), pool.underlyingDecimal)],
      });
    } else {
      borrow({
        args: [parseUnits(amount.toString(), pool.underlyingDecimal)],
      });
    }
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
      onSubmit={handleborrowsubmit}
    >
      <Input
        placeholder="0.00"
        variant="bordered"
        type="number"
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
        value={String(amount)}
        startContent={
          <Image src={pool.logo} alt="logo" width={20} height={20} />
        }
        endContent={
          <Button
            size="sm"
            onClick={() => {
              setAmount(Number(
                formatUnits(accountLiquidity ? accountLiquidity[1] : "", 18)
              )
              *100*0.8/ Number(pool.tokenPriceCents))
            }}
            className="bg-[#2D3549] text-white"
          >
            80% Limit
          </Button>
        }
      />
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between">
          <p className="text-gray-400">Borrowable Amount</p>
          <p> {(
            Number(
              formatUnits(accountLiquidity ? accountLiquidity[1] : "", 18)
            )
            *100/ Number(pool.tokenPriceCents)
          ).toFixed(6) +" "+pool.underlyingSymbol}</p>
        </div>
        <Divider className="my-4 bg-gray-600" />
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={pool.logo??getImage("Venus "+pool.underlyingSymbol)} alt="logo" width={20} height={20} />
            <p className="text-gray-400">Supply APY</p>
          </div>
          <p>{Number(pool.supplyApy)<0.01?"<0.01":Number(pool.supplyApy).toFixed(3)}%</p>
        </div>
        {
          isolated?<></>:
          (
<>
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={getImage("Venus XVS")} alt="logo" width={20} height={20} />
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
</>
          )
        }
        <Divider className="my-4 bg-gray-600" />
        <div className="flex justify-between">
          <p className="text-gray-400">{`Current :  $${(Number(formatUnits(borrowBalance??"",pool.underlyingDecimal))*Number(pool.tokenPriceCents)/100).toFixed(3)}`}</p>
          <p>Max{" "}$
            {Number(
              formatUnits(accountLiquidity ? accountLiquidity[1] : "", 18)
            ).toFixed(3)}</p>
        </div>
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
        <p className="text-gray-400">{`Supply Balance (${
             pool.underlyingSymbol
          })`}</p>

          {vtokenbalance!=undefined?(amount === 0 ? (
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
                    ) -
                  Number(amount)
                ).toFixed(6)}
              </p>
            </>
          )):<p>0.00</p>}
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
      {
        isConnected ? (
          (Number(
            formatUnits(accountLiquidity ? accountLiquidity[1] : "", 18)
          ) < Number(parseUnits(String(amount), pool.underlyingDecimal))) ?(
            <Button
              variant="bordered"
              color="primary"
              className="w-full"
              type="submit"
              disabled
            >
              Borrow Limit Exceeded
            </Button>
          ) : (
            <Button
              variant="solid"
              color="primary"
              className="w-full"
              type="submit"
              onClick={(e:any)=> handleborrowsubmit(e)}
              disabled={amount === 0}

            >
              Borrow
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
        )
      }
    </form>
  );
}

export default Borrowtab;
