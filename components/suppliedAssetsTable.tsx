import React, { useCallback } from "react";
import { Chip, Switch } from "@nextui-org/react";
import Image from "next/image";
import getImage from "@/components/abi/tokenImage";

function SuppliedAssetsTable() {
  const assets = [{"address":"0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B","symbol":"vBTC","name":"Venus BTC","underlyingAddress":"0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c","underlyingName":"BTCB Token","underlyingSymbol":"BTCB","underlyingDecimal":18,"borrowerDailyXvsMantissa":"46874999999999980800","supplierDailyXvsMantissa":"46874999999999980800","xvsBorrowIndex":"335575328565524089658675261582032143256","xvsSupplyIndex":"14938508860218795605724682122638494463056705850","borrowRatePerBlock":"465482276","supplyRatePerBlock":"20245995","exchangeRateMantissa":"203342921360854432720214413","underlyingPriceMantissa":"51197244970550000000000","totalBorrowsMantissa":"569677175159310962247","totalSupplyMantissa":"51529239912572","cashMantissa":"9908429385021587659969","totalReservesMantissa":"372262511580390","reserveFactorMantissa":"200000000000000000","collateralFactorMantissa":"800000000000000000","borrowApy":"0.489163626680371706","supplyApy":"0.021226527799290762","borrowXvsApy":"0.684911927540748793","supplyXvsApy":"0.037117793529304211","borrowXvsApr":"0.0068445869","supplyXvsApr":"0.0003721288","liquidityCents":"50728428649.8346308327523828","tokenPriceCents":"5119724.497055","totalDistributedMantissa":"9101309936367121750002","lastCalculatedXvsAccruedBlockNumber":36335373,"supplyCapsMantissa":"22770000000000000000000","borrowCapsMantissa":"3531000000000000000000","borrowerCount":790,"supplierCount":4387,"supply":0.0002804074479713076,"borrow":"0.00010000216341863"},{"address":"0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8","symbol":"vUSDC","name":"Venus USDC","underlyingAddress":"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d","underlyingName":"USD Coin","underlyingSymbol":"USDC","underlyingDecimal":18,"borrowerDailyXvsMantissa":"19531249999999977600","supplierDailyXvsMantissa":"19531249999999977600","xvsBorrowIndex":"1014819562509222347247417795619449613","xvsSupplyIndex":"1683825708134443110828865411793630187006170","borrowRatePerBlock":"20748835508","supplyRatePerBlock":"16157538025","exchangeRateMantissa":"232055989274087149417358356","underlyingPriceMantissa":"999991360000000000","totalBorrowsMantissa":"104145986420739234985822197","totalSupplyMantissa":"518693496076980268","cashMantissa":"16222080718798432925685871","totalReservesMantissa":"2134345177599648284355","reserveFactorMantissa":"100000000000000000","collateralFactorMantissa":"825000000000000000","borrowApy":"24.290232411788386228","supplyApy":"18.45267228598462037","borrowXvsApy":"0.079680790958060131","supplyXvsApy":"0.068939692900767307","borrowXvsApr":"0.0007986797","supplyXvsApr":"0.0006910534","liquidityCents":"1622194056.0021022507225393","tokenPriceCents":"99.999136","totalDistributedMantissa":"3723244514174069166426","lastCalculatedXvsAccruedBlockNumber":36335533,"supplyCapsMantissa":"258000000000000000000000000","borrowCapsMantissa":"124700000000000000000000000","borrowerCount":2128,"supplierCount":2967,"supply":2.0011324309201797,"borrow":"0"}]
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
            <h2>{(value?.supply ).toFixed(5)} {value?.underlyingSymbol}</h2>
            <h2 className="text-[#AAB3CA]">$ {(value?.supply* Number(value?.tokenPriceCents) / 100).toFixed(2)}</h2>
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
