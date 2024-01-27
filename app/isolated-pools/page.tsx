"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { testnet } from "@/components/contracts";
import { useContractRead } from "wagmi";
import { PoolLensabi } from "@/components/abi/Poolabi";

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
  return (
    <>
      <div
        className="w-full flex flex-col items-center  justify-center bg-[#181d27]"
        aria-label="Core Pool table"
      >
        <div className="w-4/5 py-6 text-white mt-20 bg-[#1E2431] rounded-3xl">
          <table className=" w-full">
            <thead className="w-full grid col-6">
              <tr>
                <th className="text-[#AAB3CA] text-sm font-normal text-end">
                  Assets{" "}
                </th>

                <th className="text-[#AAB3CA] text-sm font-normal text-end">
                  Name{" "}
                </th>

                <th className="text-[#AAB3CA] text-sm font-normal text-end">
                  Total supply{" "}
                </th>
                <th className="text-[#AAB3CA] text-sm font-normal text-end">
                  Total borrow{" "}
                </th>

                <th className="text-[#AAB3CA] text-sm font-normal text-end">
                  Liquidity{" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(pools) &&
                pools.map((pool: any, index: number) => (
                  <Link href={"/isolated-pools/" + pool.name}>
                    <tr key={index}>
                      <td className="text-end px-4"></td>
                      <td className="text-end px-4">{pool.name}</td>
                      <td className="text-end px-4">{pool.totalSupply}</td>
                      <td className="text-end px-4">{pool.totalBorrow}</td>
                      <td className="text-end px-4">{pool.liquidity}</td>
                    </tr>
                  </Link>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
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
