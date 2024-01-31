"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CircularProgress } from "@nextui-org/react";
import PoolTable from "@/components/poolTable";
import { dummyPools, columns } from "@/components/dummyData";

const Page = () => {
  const { section } = useParams<{ section: string }>();
  const [loading, setLoading] = useState(false);
  const [pool, setPool] = useState(dummyPools);
  //   useEffect(() => {
  //     async function fetchData() {
  //       setLoading(true);
  //       const res = await fetch("/api/isolatedpools?chain=bsctestnet");
  //       const data = await res.json();
  //       const pools_json = JSON.parse(data);
  //       const pool = pools_json.filter((pool: any) => pool.name === section);
  //       console.log(pool);
  //       setPool(pool);
  //       setLoading(false);
  //     }
  //     fetchData();
  //   }, []);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch("/api/isolatedpools?chain=bsctestnet");
      const data = await res.json();
      const pools_json = JSON.parse(data);
      setPool(pools_json);
      setLoading(false);
    }
    fetchData();
  }, []);
  console.log(pool);
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
        <PoolTable columns={columns} tableData={pool} />
      )}
    </div>
    // <div>
    //   <h1>Isolated Pool</h1>
    //   <div className="w-full flex flex-col items-center  justify-center bg-[#181d27]">
    //     {/* {Array.isArray(pool[0]?.vTokens) &&
    //       pool[0]?.vTokens.map((token: any, index: number) => (
    //         <>
    //           <div className="w-full flex flex-col items-center  justify-center bg-[#181d27]">
    //             <Link href={`/isolated-pools/${pool[0]?.name}/${token.vToken}`}>
    //               <h1>{token.vToken}</h1>
    //             </Link>
    //           </div>
    //         </>
    //       ))} */}
    //   </div>
    // </div>
  );
};

export default Page;
