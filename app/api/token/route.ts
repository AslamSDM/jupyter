import { NextRequest, NextResponse } from "next/server";
import { bsc, bscTestnet } from "viem/chains";
import { createPublicClient, http } from "viem";
import { vTokenabi } from "@/components/abi/vTokenabi";

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(),
});
const bscTestnetClient = createPublicClient({
  chain: bscTestnet,
  transport: http(),
});

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.nextUrl);
  const chain = url.searchParams.get("chain");
  const address = url.searchParams.get("address");

  console.log(chain);
  const replacer = (key: string, value: any) =>
    typeof value === "bigint" ? value.toString() : value;
  if (chain === "bsc") {
    const underlying_address = await bscClient.readContract({
      address: address as `0x${string}`,
      abi: vTokenabi,
      functionName: "underlying",
    });
    return NextResponse.json(underlying_address);
} else {
    console.log("testnet");
    const underlying_address = await bscTestnetClient.readContract({
        address: address as `0x${string}`,
        abi: vTokenabi,
        functionName: "underlying",
    });

    return NextResponse.json(underlying_address);
  }
}
