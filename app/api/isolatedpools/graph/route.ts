import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest,res:NextResponse) {
const url = 'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools';
const query = `
  query {
    
      pools {
        id
        markets {
          supplierCount
          borrowerCount
          symbol
          totalSupplyMantissa
          totalBorrowsMantissa
          underlyingPriceCents
        }
      }
    }
  
`;

const resp = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
    return data;
})
.catch(error => console.error('Error:', error));
return NextResponse.json(resp.data.pools);

}
