"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CircularProgress } from "@nextui-org/react";
import PoolTable from "@/components/poolTable";
import { columns } from "@/components/dummyData";

const Page = () => {
  const { section } = useParams<{ section: string }>();
  const [loading, setLoading] = useState(false);
  const [pool, setPool] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch("/api/isolatedpools?chain=bsctestnet");
      const data = await res.json();
      const pools_json = JSON.parse(data);
      const pool_ = pools_json.filter((pool: any) => pool.name === section);
      setPool(pool_);
      console.log(pool_);
      setLoading(false);
    }
    fetchData();
  }, []);

  //Data to be implemented !!!!

  console.log(pool[0]?.vTokens);
  return (
    <div className="w-full flex flex-col gap-10 px-10 py-8">
      <div className="flex justify-between">
        <h2 className="text-xl text-gray-400 font-bold">
          Isolated pools / <span className="text-white">Defi</span>
        </h2>
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
        <PoolTable
          columns={columns}
          tableData={pool[0]?.vTokens || []}
          poolType="isolated"
        />
      )}
    </div>
  );
};

export default Page;
