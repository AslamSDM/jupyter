import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import getImage from "./abi/tokenImage";
import { isolatedtokens } from "@/config/isolatedtokens";
import { formatNumber } from "@/app/utils/formatNumber";

function IsolatedPoolsTable({ columns, pools, total }: any) {
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

  const renderCell = useCallback(
    (pool: any, columnKey: any) => {
      switch (columnKey) {
        case "assets":
          const poolAssets = pool.vTokens.map(
            (vToken: any) =>
              "Venus " +
              isolatedtokens.find(
                (token: any) =>
                  String(token.id).toLocaleLowerCase() ===
                  String(vToken.vToken).toLocaleLowerCase()
              )?.underlyingSymbol
          );
          return (
            <div className="p-4 flex items-center gap-2 justify-start pl-2">
              {poolAssets.map((asset: any, i: number) => (
                <Image
                  src={getImage(asset)}
                  alt="coin"
                  width={20}
                  height={20}
                  key={i}
                />
              ))}
            </div>
          );
        case "pool":
          return <p className="py-4 text-end">{pool.name}</p>;
        case "totalSupply":
          return (
            <div className="flex flex-col">
              <p className="py-4">
                $ {formatNumber(String(total[pool.name]["supply"] * 100))}
              </p>
            </div>
          );

        case "totalBorrow":
          return (
            <div className="py-4 flex justify-end">
              <p className="">
                $ {formatNumber(String(total[pool.name]["borrow"] * 100))}
              </p>
            </div>
          );

        case "liquidity":
          return (
            <div className="py-4 flex flex-col justify-end">
              <p className="">
                $
                {formatNumber(
                  String(
                    (total[pool.name]["supply"] - total[pool.name]["borrow"]) *
                      100
                  )
                )}
              </p>
            </div>
          );

        default:
          return null;
      }
    },
    [total]
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block py-6 text-white bg-[#1E2431] rounded-3xl">
        <table className="w-full text-md">
          <thead className="text-[#AAB3CA] text-md text-end">
            <tr>
              {Array.isArray(columns) ? (
                columns?.map((column: any) => (
                  <th scope="col" className="font-medium" key={column.key}>
                    {renderHeaderCell(column.key)}
                  </th>
                ))
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pools) ? (
              pools.map((pool: any, index: number) => (
                <tr key={index}>
                  {columns.map((column: any) => (
                    <td key={column.key} className="text-end px-4">
                      <Link className="" href={`/isolated-pools/${pool.name}`}>
                        {renderCell(pool, column.key)}
                      </Link>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden w-full flex flex-col gap-8 justify-start mb-20">
        {pools.map((pool: any, index: number) => (
          // <Link className="" href={`/isolated-pools/${pool.name}`}></Link>
          <Link
            key={index}
            href={`/isolated-pools/${pool.name}`}
            className="bg-[rgb(30,36,49)] rounded-xl p-4 flex flex-col gap-4"
          >
            {/* <div className="flex justify-start items-center gap-2"> */}
            <div className="p-4 flex items-center gap-2 justify-start pl-2">
              {pool.vTokens.map((vToken: any, i: number) => (
                <Image
                  src={getImage(
                    "Venus " +
                      isolatedtokens.find(
                        (token: any) =>
                          String(token.id).toLocaleLowerCase() ===
                          String(vToken.vToken).toLocaleLowerCase()
                      )?.underlyingSymbol
                  )}
                  alt="coin"
                  width={20}
                  height={20}
                  key={i}
                />
              ))}
              {/* </div> */}
            </div>
            <div className="h-px w-full bg-gray-400" />
            <div className="flex justify-between items-start">
              <div className="flex flex-col justify-start gap-2 w-1/2">
                <p className="text-[#AAB3CA] text-xs">Pool</p>
                <p className="text-white text-sm">{pool.name}</p>
              </div>
              <div className="flex flex-col justify-start gap-2 w-1/2">
                <p className="text-[#AAB3CA] text-xs">Total Supply</p>
                <p className="text-white text-sm">
                  {" "}
                  $ {formatNumber(String(total[pool.name]["supply"] * 100))}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex flex-col justify-start gap-2 w-1/2">
                <p className="text-[#AAB3CA] text-xs">Total Borrow</p>
                <p className="text-white text-sm">
                  $ {formatNumber(String(total[pool.name]["borrow"] * 100))}
                </p>
              </div>
              <div className="flex flex-col justify-start gap-2 w-1/2">
                <p className="text-[#AAB3CA] text-xs">Liquidity</p>
                <p className="text-white text-sm">
                  $
                  {formatNumber(
                    String(
                      (total[pool.name]["supply"] -
                        total[pool.name]["borrow"]) *
                        100
                    )
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default IsolatedPoolsTable;
