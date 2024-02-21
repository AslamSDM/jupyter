import React, { useCallback } from "react";
import { Chip, Switch } from "@nextui-org/react";
import Image from "next/image";
import getImage from "@/components/abi/tokenImage";

function SuppliedAssetsTable() {
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

  const renderCell = useCallback((columnKey: any, value: any) => {
    switch (columnKey) {
      case "asset":
        return (
          <div className="flex items-center gap-1 pl-2">
            <Image
              src={getImage("Venus BTC")}
              alt="logo"
              width={24}
              height={24}
            />
            <p className="text-white">BTCB</p>
          </div>
        );
      case "apyLtv":
        return (
          <div className=" flex flex-col gap-0.5 justify-end items-end">
            <h2 className="text-white">
              0.06% / <span className="text-[#AAB3CA]">80%</span>
            </h2>
            <Chip color="success" size="sm" radius="full">
              0.06%
            </Chip>
          </div>
        );
      case "balance":
        return (
          <div className=" flex flex-col gap-0.5 justify-end text-white">
            <h2>0.00028 BTCB</h2>
            <h2 className="text-[#AAB3CA]">$14.37</h2>
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
              <p className="">APY / LTV</p>
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
          <tr>
            {suppliedTableFields.map((field) => (
              <td key={field.key} className="text-end py-2">
                {renderCell(field.key, "0.00028 BTCB")}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SuppliedAssetsTable;
