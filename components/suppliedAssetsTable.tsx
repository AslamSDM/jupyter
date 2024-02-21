import React, { useCallback } from "react";
import { Chip, Switch } from "@nextui-org/react";
import Image from "next/image";
import getImage from "@/components/abi/tokenImage";

function SuppliedAssetsTable({assets}:any) {
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

  const renderCell = useCallback((columnKey: any, value: any) => {
    console.log({value, columnKey})
    if(!value) return null;
    const imageurl = getImage(value?.name??"");
    console.log(value.supply)
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
        console.log(value?.supply)
        return (
          <div className=" flex flex-col gap-0.5 justify-end text-white">
            <h2>{value?.supply } {value?.underlyingSymbol}</h2>
            <h2 className="text-[#AAB3CA]">$ {value?.supply* Number(value?.tokenPriceCents) / 100}</h2>
          </div>
        );
      case "collateral":
        return (
          <div className=" flex flex-col items-end">
            <Switch size="sm" />
          </div>
        );

      default:
        return null;
    }
  }, []);
console.log(assets)

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
        return <p className="">Balance</p>;
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
    <div className="w-[45%] bg-[#1E2431] rounded-xl p-6 space-y-4">
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
