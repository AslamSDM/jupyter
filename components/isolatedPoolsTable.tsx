import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import getImage from "./abi/tokenImage";

function IsolatedPoolsTable({ columns, pools }: any) {
  console.log(pools);
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

      case "price":
        return <p className="p-4 pr-6">Price</p>;

      default:
        return null;
    }
  }, []);

  const renderCell = useCallback((pool: any, columnKey: any) => {
    switch (columnKey) {
      case "assets":
        const poolAssets = [
          "Venus BNB",
          "Venus BUSD",
          "Venus DAI",
          "Venus ETH",
          "Venus LINK",
        ];
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
            <p className="py-4">23281731</p>
          </div>
        );

      case "totalBorrow":
        return (
          <div className="py-4 flex justify-end">
            <p className="">31435</p>
          </div>
        );

      case "liquidity":
        return (
          <div className="py-4 flex flex-col justify-end">
            <p className="">311344</p>
          </div>
        );

      case "price":
        return <p className="py-4 pr-6">Price</p>;

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
