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
  const graphurl = 'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools';
  const query = `
    query {
  
          markets (id: "${address}") {
     underlyingSymbol
     id
          }
        
      }
    
  `;
  
  const resp = await fetch(graphurl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
      return data;
  })
  return NextResponse.json(resp.data.markets);

}
