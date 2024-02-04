"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { testnet } from "@/components/contracts";
import { useContractRead } from "wagmi";
import { PoolLensabi } from "@/components/abi/Poolabi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CircularProgress } from "@nextui-org/react";
import IsolatedPoolsTable from "@/components/isolatedPoolsTable";

const IsolatedPoolsPage = () => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch("/api/isolatedpools?chain=bsctestnet");
      const data = await res.json();
      const pools_json = JSON.parse(data);
      setPools(pools_json);
      setLoading(false);
    }
    fetchData();
  }, []);
  console.log(pools);
  const columns = [
    {
      key: "assets",
      label: "Assets",
    },
    {
      key: "pool",
      label: "Pool",
    },
    {
      key: "totalSupply",
      label: "Total Supply",
    },
    {
      key: "totalBorrow",
      label: "Total Borrow",
    },
    {
      key: "liquidity",
      label: "Liquidity",
    },
  ];
  return (
    <div className="w-full flex flex-col gap-10 px-10 py-8">
      <div className="flex justify-between">
        <h2 className="text-xl text-white font-bold">Isolated pools</h2>
        <ConnectButton />
      </div>
      <div className="w-full rounded-xl bg-[#1E2431] flex justify-start gap-10 p-6 font-semibold text-xl">
        <div className="flex flex-col">
          <p className="text-gray-400">Total Supply</p>
          <p className="text-white">$1.45B</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400">Total Borrow</p>
          <p className="text-white">$1.45B</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400">Available Liquidity</p>
          <p className="text-white">$1.45B</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400">Total Treasury</p>
          <p className="text-white">30</p>
        </div>
      </div>
      {loading ? (
        <div className="w-full flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <IsolatedPoolsTable columns={columns} pools={pools} />
      )}
    </div>
  
  );

};
export default IsolatedPoolsPage;
