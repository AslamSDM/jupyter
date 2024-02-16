import { NextRequest, NextResponse } from "next/server";
import { bsc,bscTestnet } from "viem/chains";
import { createPublicClient, http } from "viem";
import { mainnet, testnet } from "@/components/contracts";
import { PoolLensabi } from "@/components/abi/Poolabi";

const bscClient = createPublicClient({
    chain: bsc,
    transport: http()
  })
  const bscTestnetClient = createPublicClient({
    chain: bscTestnet,
    transport: http()
    })

export async function GET(req:NextRequest,res:NextResponse) {
const url = new URL(req.nextUrl);
const chain = url.searchParams.get("chain");
console.log(chain);
const replacer = (key: string, value: any) => 
typeof value === 'bigint' ? value.toString() : value;
if(chain === "bsc"){
    const pools = await bscClient.readContract({
        address: mainnet.PoolLens as `0x${string}`,
        abi :PoolLensabi,
        functionName:"getAllPools",
        args:[mainnet.PoolRegistry]
    });
    
    return NextResponse.json(JSON.stringify(pools, replacer));}
    else {
        console.log("testnet");
        const pools = await bscTestnetClient.readContract({
            address: testnet.PoolLens as `0x${string}`,
            abi :PoolLensabi,
            functionName:"getAllPools",
            args:[testnet.PoolRegistry]
        });
    return NextResponse.json(JSON.stringify(pools, replacer));}




}