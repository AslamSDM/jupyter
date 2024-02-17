import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import getImage from "./abi/tokenImage";
import { isolatedtokens } from "@/config/isolatedtokens";
import { formatNumber } from "@/app/utils/formatNumber";

function IsolatedPoolsTable({ columns, pools,total }: any) {
  const renderHeaderCell = useCallback((columnKey: any) => {
    switch (columnKey) {
      case "assets":
        return (
          <div className="p-4 flex items-center text-start pl-6">
            <p className="">Assets</p>
          </div>
        );
      case "pool":
        return (
          <div className="flex flex-col">
            <p className="p-4">Pool</p>
          </div>
        );
      case "totalSupply":
        return (
          <div className="flex flex-col">
            <p className="p-4">Total Supply</p>
          </div>
        );

      case "totalBorrow":
        return (
          <div className="p-4 flex justify-end">
            <p className="">Total Borrow</p>
          </div>
        );

      case "liquidity":
        return (
          <div className="p-4 flex flex-col justify-center">
            <p className="">Liquidity</p>
          </div>
        );



      default:
        return null;
    }
  }, []);

  const renderCell = useCallback((pool: any, columnKey: any) => {
    switch (columnKey) {
      case "assets":
        const poolAssets = pool.vTokens.map((vToken: any) => "Venus "+(isolatedtokens.find((token: any) => String(token.id).toLocaleLowerCase() === String(vToken.vToken).toLocaleLowerCase()))?.underlyingSymbol);

        return (
          <div className="p-4 flex items-center gap-2 justify-start pl-2">
            {poolAssets.map((asset: any) => (
              <Image src={getImage(asset)} alt="coin" width={20} height={20} />
            ))}
          </div>
        );
      case "pool":
        return <p className="py-4 text-end">{pool.name}</p>;
      case "totalSupply":
        return (
          <div className="flex flex-col">
            <p className="py-4">$ {formatNumber(String(total[pool.name]["supply"]*100))}</p>
          </div>
        );

      case "totalBorrow":
        return (
          <div className="py-4 flex justify-end">
            <p className="">$ {formatNumber(String(total[pool.name]["borrow"]*100))}</p>
          </div>
        );

      case "liquidity":
        return (
          <div className="py-4 flex flex-col justify-end">
            <p className="">${formatNumber(String((total[pool.name]["supply"]-total[pool.name]["borrow"])*100))}</p>
          </div>
        );



      default:
        return null;
    }
  }, []);

  return (
    <div className="py-6 text-white bg-[#1E2431] rounded-3xl">
      <table className="w-full text-md">
        <thead className="text-[#AAB3CA] text-md text-end">
          <tr>
            {columns.map((column: any) => (
              <th scope="col" className="font-medium" key={column.key}>
                {renderHeaderCell(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pools.map((pool: any, index: number) => (
            <tr>
              {columns.map((column: any) => (
                <td key={column.key} className="text-end px-4">
                  <Link className="" href={`/isolated-pools/${pool.name}`}>
                    {renderCell(pool, column.key)}
                  </Link>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IsolatedPoolsTable;
