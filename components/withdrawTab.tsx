import Image from "next/image";
import { useState } from "react";
import { Input, Button, Divider } from "@nextui-org/react";
import { formatUnits, parseUnits } from "viem";
import { getExchangeRate } from "@/app/utils/formatNumber";
import getImage from "./abi/tokenImage";

function WithdrawTab({ pool, approve, id, redeem,
  isConnected,underlyingbalance, vtokenbalance, allowance, refetchbalance,accountLiquidity,borrowBalance,isolated
 }: any) {
  const [amount, setAmount] = useState(0);
  const handlewithdrawsubmit = async (e: any) => {
    e.preventDefault();
    if (allowance.data < parseUnits(String(amount), pool.underlyingDecimal)) {
      return;
    }
    redeem({
      args: [parseUnits(amount.toString(), pool.underlyingDecimal)],
    });
  };
  const handleApprove = async (e: any) => {
    approve({ args: [id, parseUnits(amount.toString(), 8)] });
  }
  const progress =
  ((Number(formatUnits(borrowBalance ?? "", pool.underlyingDecimal)) *
    Number(pool.tokenPriceCents)) /
    100 /
    Number(formatUnits(accountLiquidity ? accountLiquidity[1] : "", 18))) *
  100;
  const imageurl = getImage(("Venus "+pool.underlyingSymbol));
  return (
    <form
      className="flex flex-col gap-3 items-center text-white"
      onSubmit={handlewithdrawsubmit}
    >
      <Input
        placeholder="0.00"
        variant="bordered"
        type="number"
        value={String(amount)}

        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
        startContent={
          <Image src={pool.logo??imageurl} alt="logo" width={20} height={20} />
        }
        endContent={
          <Button
            size="sm"
            onClick={() => {
              setAmount(Number(vtokenbalance!=undefined? (
                  (
                    Number(vtokenbalance?.formatted) /
                    Number(
                      getExchangeRate(
                        pool.exchangeRateMantissa,
                        8,
                        pool.underlyingDecimal
                      )
                    )
                  )
              ):0.00));
            }}
            className="bg-[#2D3549] text-white"
          >
            Max
          </Button>
        }
      />
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between">
          <p>Withdrawable amount</p>
          {vtokenbalance!=undefined? (
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
              ).toFixed(6) +" "+ pool.underlyingSymbol}
            </p>
          ):<p>0.00{ +" "+ pool.underlyingSymbol}</p>}
        </div>
        <Divider className="my-4" />
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={pool.logo??imageurl} alt="logo" width={20} height={20} />
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
          <Image src="https://app.venus.io/assets/xvs-e7b82352.svg" alt="logo" width={20} height={20} />
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
        <Divider className="my-4" />
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
          (Number(vtokenbalance?.formatted) /
          Number(
            getExchangeRate(
              pool.exchangeRateMantissa,
              8,
              pool.underlyingDecimal
            )
          ))>Number(amount)?(
          ((Number(allowance.data) < Number(parseUnits(String(amount), pool.underlyingDecimal)) || pool.underlyingSymbol=="BNB")?(
            <Button
              variant="bordered"
              color="primary"
              className="w-full"
              type="submit"
              onClick={(e:any)=> handleApprove(e)}
            >
              Approve
            </Button>
          ) : (
            <Button
              variant="solid"
              color="primary"
              className="w-full"
              type="submit"
              onClick={(e:any)=> handlewithdrawsubmit(e)}
            >
              Withdraw
            </Button>
          ))):(
            <Button
              variant="bordered"
              color="primary"
              className="w-full"
              type="submit"
              disabled
            >
              Withdraw Limit Exceeded
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

export default WithdrawTab;
