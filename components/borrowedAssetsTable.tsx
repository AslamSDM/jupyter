import React, { useCallback } from "react";
import { Chip, Progress, Switch } from "@nextui-org/react";
import Image from "next/image";
import getImage from "@/components/abi/tokenImage";
import { useAccount, useContractRead } from "wagmi";
import { newcomptrollerabi } from "./abi/comptrollerabi";
import { formatUnits } from "viem";

function BorrowedAssetsTable({assets,isolated,corecomptroller}:any) {
  const {address} = useAccount()
  const fields = [
    {
      key: "asset",
      label: "Asset",
    },
    {
      key: "apy",
      label: "APY",
    },
    { key: "balance", label: "Balance" },
    { key: "percentageLimit", label: "% of limit" },
  ];
  const {data:accountLiquidity} = useContractRead({
    address: !isolated? corecomptroller: assets.comptroller as `0x${string}`,
    abi:newcomptrollerabi,
    functionName:"getAccountLiquidity",
    args:[address as `0x${string}`]
  })
  const borrowPower = useContractRead({
    address: !isolated? corecomptroller: assets.comptroller as `0x${string}`,
    abi:newcomptrollerabi,
    functionName:"getBorrowingPower",
    args:[address as `0x${string}`]
  })
  const renderCell = useCallback((columnKey: any, value: any) => {

    if(!value) return null;
    const imageurl = getImage(value?.name??"");
    if(isolated){
      value["tokenPriceCents"]= value.price*100
    }
    switch (columnKey) {
      case "asset":
        return (
          <div className="flex items-center gap-1 pl-2">
            <Image
              src={imageurl}
              alt="logo"
              width={24}
              height={24}
            />
            <p className="text-white">{value.underlyingSymbol}</p>
          </div>
        );
      case "apy":
        return (
          <div className=" flex flex-col gap-0.5 justify-end items-end">
            <h2 className="text-white">
              {value.supplyApy?Number(value.borrowApy).toFixed(2):0}%
            </h2>
     
          </div>
        );
      case "balance":
        return (
          <div className=" flex flex-col gap-0.5 justify-end text-white">
            <h2 className="flex justify-end">{(value?.supply ).toFixed(5)} {value?.underlyingSymbol}</h2>
            <h2 className="flex justify-end text-[#AAB3CA]">$ {(value?.borrow* Number(value?.tokenPriceCents) / 100).toFixed(2)}</h2>
          </div>
        );
      case "percentageLimit":
        if(isolated){
          if(!borrowPower.data || !Array.isArray(borrowPower.data)) return null;
          return (
            <div className="w-full flex flex-col gap-0.5 justify-end items-end pl-6">
            <h2>{(value?.borrow* Number(value?.price))/Number(formatUnits(borrowPower.data[1] as bigint,18))}%</h2>
            <div className="relative w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 bg-green-600 absolute rounded-full"
                style={{ width: `${(value?.borrow* Number(value?.price))/Number(isolated?formatUnits(borrowPower.data[1] as bigint??"",18)??"":(accountLiquidity??""))}%` }}
                ></div>
            </div>
          </div>
        );
      }else{
        if(!accountLiquidity|| !Array.isArray(accountLiquidity)) return null;
        return (
          <div className="w-full flex flex-col gap-0.5 justify-end items-end pl-6">
            <h2>{((value?.borrow* Number(value?.tokenPriceCents) )/Number(formatUnits(accountLiquidity[1] as bigint,18))).toFixed(2)}%</h2>
            <div className="relative w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 bg-green-600 absolute rounded-full"
                style={{ width: `${((value?.borrow* Number(value?.tokenPriceCents) )/Number(formatUnits(accountLiquidity[1] as bigint,18))).toFixed(0)}%` }}
              ></div>
            </div>
          </div>
        );
        }

      default:
        return null;
    }
  }, []);

  const renderHeaderCell = useCallback((columnKey: any) => {
    switch (columnKey) {
      case "asset":
        return (
          <div className="flex items-center text-start pl-2">
            <p className="">Asset</p>
          </div>
        );
      case "apy":
        return (
          <div className="flex justify-end">
            <button>
              <p className="">APY</p>
            </button>
          </div>
        );
      case "balance":
        return (
          
          <div className="flex justify-end">
          <p className="">Balance</p>
          </div>
            )
      case "percentageLimit":
        return (
          <div className=" flex justify-end">
            <p className="">% of limit</p>
          </div>
        );

      default:
        return null;
    }
  }, []);
  return (
    <div className="w-[48%] bg-[#1E2431] rounded-xl p-6 space-y-2">
      <h2 className="text-xl text-white font-bold">Borrowed Assets</h2>
      <table className="w-full text-md">
        <thead className="text-[#AAB3CA] text-md text-end">
          <tr>
            {fields.map((field) => (
              <th scope="col" className="font-medium" key={field.key}>
                {renderHeaderCell(field.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white">
          {assets.map((asset:any,i:number) => (
            asset.borrow>0?(

              <tr key={i}>
            
              {fields.map((field) => (
                <td key={field.key}>
                  {renderCell(field.key, asset)}
                </td>
              ))}
          </tr>
              ):
              null
            )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default BorrowedAssetsTable;
