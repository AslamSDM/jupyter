import React, { useCallback } from "react";
import { Chip, Switch } from "@nextui-org/react";
import Image from "next/image";
import getImage from "@/components/abi/tokenImage";
import { useAccount, useContractWrite } from "wagmi";
import { newcomptrollerabi } from "./abi/comptrollerabi";

function SuppliedAssetsTable({assets,isolated,corecomptroller}:any) {
  const {address} = useAccount()
  const suppliedTableFields = [
    {
      key: "asset",
      label: "Asset",
    },
    {
      key: "apyLtv",
      label: "APY / LTV",
    },
    { key: "balance", label: "Balance" },
    { key: "collateral", label: "Collateral" },
  ];
  const suppliedTable = [
    {
      key: "asset",
      label: "Asset",
    },
    {
      key: "apyLtv",
      label: "APY / LTV",
    },
    { key: "balance", label: "Balance" },
    { key: "collateral", label: "Collateral" },
  ];

  const { write: exitMarket } = useContractWrite({
    address: !isolated? corecomptroller: assets.comptroller as `0x${string}`,
    abi: newcomptrollerabi,
    functionName: "exitMarket",
  });


  const renderCell = useCallback((columnKey: any, value: any) => {
    if(!value) return null;
    const imageurl = getImage(value?.name??"");
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
      case "apyLtv":
        return (
          <div className=" flex flex-col gap-0.5 justify-end items-end">
            <h2 className="text-white">
              {value.supplyApy?Number(value.supplyApy).toFixed(2):0}%
            </h2>
     
          </div>
        );
      case "balance":
        return (
          <div className=" flex flex-col gap-0.5 justify-end text-white">
            <h2 className="flex justify-end">{(value?.supply ).toFixed(5)} {value?.underlyingSymbol}</h2>
            <h2 className="flex justify-end text-[#AAB3CA]">$ {(value?.supply* Number(value?.tokenPriceCents) / 100).toFixed(2)}</h2>
          </div>
        );
      case "collateral":
        return (
          <div className="flex flex-col justify-end relative">
            <Switch isSelected onClick={()=>exitMarket({
              args:[value?.address]
            })} className="absolute right-0" size="sm" />
          </div>
        );

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
      case "apyLtv":
        return (
          <div className="flex justify-end">
            <button>
              <p className="">APY </p>
            </button>
          </div>
        );
      case "balance":
        return (
          
          <div className="flex justify-end">
          <p className="">Balance</p>
          </div>
            )
      case "collateral":
        return (
          <div className=" flex flex-col justify-end">
            <p className="">Collateral</p>
          </div>
        );

      default:
        return null;
    }
  }, []);

  if (!assets) return null;
  return (
    <div className="w-[49%] bg-[#1E2431] rounded-xl p-6 space-y-4">
      <h2 className="text-xl text-white font-bold">Supplied Assets</h2>
      <table className="w-full text-md">
        <thead className="text-[#AAB3CA] text-md text-end">
          <tr>
            {suppliedTableFields.map((field) => (
              <th scope="col" className="font-medium" key={field.key}>
                {renderHeaderCell(field.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white">
            {assets.map((asset:any) => (
          <tr>
      
              {suppliedTable.map((field) => (
                <td key={field.key}>
                  {renderCell(field.key, asset)}
                </td>
              ))}
          </tr>
            )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default SuppliedAssetsTable;
