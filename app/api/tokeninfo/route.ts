import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    const url = new URL(req.nextUrl);
    const address = url.searchParams.get('address');
    const chain = url.searchParams.get('chain');
    const query = `
    query GetTokens($ids: [TokenInput!]!) {
      tokens(ids: $ids) {
        address
        decimals
        id
        name
        networkId
        symbol
        imageLargeUrl
        imageSmallUrl
        imageThumbUrl
        explorerData {
          id
          blueCheckmark
          description
          divisor
          tokenPriceUSD
          tokenType
        }
        info {
          address
          circulatingSupply
          id
          imageLargeUrl
          imageSmallUrl
          imageThumbUrl
          isScam
          name
          networkId
          symbol
          totalSupply
        }
        socialLinks {
          bitcointalk
          blog
          coingecko
          coinmarketcap
          discord
          email
          facebook
          github
          instagram
          linkedin
          reddit
          slack
          telegram
          twitch
          twitter
          website
          wechat
          whitepaper
          youtube
        }
      }
    }
  `;
  const variables = {
    ids: [
      {
        address: address,
        networkId: Number(chain),
      },
    ],
  };

  const requestBody = {
    query,
    variables,
  };
  const endpoint = 'https://graph.defined.fi/graphql';

    const res = await axios.post(endpoint, requestBody, {
        headers: {
          authority: 'graph.defined.fi',
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9,ko;q=0.8',
          authorization: "1f588b30a30e8a54f1d1287b24d71913b5d5368c",
          'content-type': 'application/json',
          origin: 'https://www.defined.fi',
          referer: 'https://www.defined.fi/',
          'sec-ch-ua':
            '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
          'x-amz-user-agent': 'aws-amplify/3.0.7',
        },
      }).then((response) => {
        console.log(response.data);
        return response.data?.tokens[0];
      });
      NextResponse.json(res);
}