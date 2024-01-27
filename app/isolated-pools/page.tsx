"use client";
import { testnet } from "@/components/contracts";
import { useContractRead } from "wagmi";
import { PoolLensabi } from "@/components/abi/Poolabi";

const IsolatedPoolsPage = () => {
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
