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
    // <>
    //   <div
    //     className="w-full flex flex-col items-center  justify-center bg-[#181d27]"
    //     aria-label="Core Pool table"
    //   >
    //     <div className="w-4/5 py-6 text-white mt-20 bg-[#1E2431] rounded-3xl">
    //       <table className=" w-full">
    //         <thead className="w-full grid col-6">
    //           <tr>
    //             <th className="text-[#AAB3CA] text-sm font-normal text-end">
    //               Assets{" "}
    //             </th>

    //             <th className="text-[#AAB3CA] text-sm font-normal text-end">
    //               Name{" "}
    //             </th>

    //             <th className="text-[#AAB3CA] text-sm font-normal text-end">
    //               Total supply{" "}
    //             </th>
    //             <th className="text-[#AAB3CA] text-sm font-normal text-end">
    //               Total borrow{" "}
    //             </th>

    //             <th className="text-[#AAB3CA] text-sm font-normal text-end">
    //               Liquidity{" "}
    //             </th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {Array.isArray(pools) &&
    //             pools.map((pool: any, index: number) => (
    //               <Link href={"/isolated-pools/" + pool.name}>
    //                 <tr key={index}>
    //                   <td className="text-end px-4"></td>
    //                   <td className="text-end px-4">{pool.name}</td>
    //                   <td className="text-end px-4">{pool.totalSupply}</td>
    //                   <td className="text-end px-4">{pool.totalBorrow}</td>
    //                   <td className="text-end px-4">{pool.liquidity}</td>
    //                 </tr>
    //               </Link>
    //             ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </>
  );
  const { data: isopools } = useContractRead({
    address: testnet.PoolLens as `0x${string}`,
    abi: PoolLensabi,
    functionName: "getAllPools",
    args: [testnet.PoolRegistry],
  });
  console.log(isopools);
  console.log(testnet.PoolRegistry);

  return (
    <div>
      <h1>Isolated Pools</h1>
    </div>
  );
};
export default IsolatedPoolsPage;
