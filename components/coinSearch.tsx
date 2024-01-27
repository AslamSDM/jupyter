import { Input } from "@nextui-org/input";
import React, { useState } from "react";
import Logo from "../assets/logo.svg";
import Image from "next/image";
import { Button } from "@nextui-org/button";

function CoinSearch({ setOpenSearch, setCoin }: any) {
  const [searchTerm, setSearchTerm] = useState("");

  const coinList = [
    { name: "BNB", symbol: "BNB" },
    { name: "Bitcoin", symbol: "BTC" },
    { name: "Ethereum", symbol: "ETH" },
    { name: "Cardano", symbol: "ADA" },
    { name: "Tether", symbol: "USDT" },
    { name: "XRP", symbol: "XRP" },
    { name: "Solana", symbol: "SOL" },
    { name: "Polkadot", symbol: "DOT" },
    { name: "USD Coin", symbol: "USDC" },
    { name: "Dogecoin", symbol: "DOGE" },
    { name: "Avalanche", symbol: "AVAX" },
    { name: "Shiba Inu", symbol: "SHIB" },
    { name: "Crypto.com Coin", symbol: "CRO" },
    { name: "Wrapped Bitcoin", symbol: "WBTC" },
    { name: "Litecoin", symbol: "LTC" },
    { name: "Binance USD", symbol: "BUSD" },
    { name: "Chainlink", symbol: "LINK" },
    { name: "Polygon", symbol: "MATIC" },
    { name: "Stellar", symbol: "XLM" },
    { name: "Dai", symbol: "DAI" },
    { name: "Uniswap", symbol: "UNI" },
    { name: "Bitcoin Cash", symbol: "BCH" },
    { name: "Algorand", symbol: "ALGO" },
    { name: "Internet Computer", symbol: "ICP" },
    { name: "Axie Infinity", symbol: "AXS" },
    { name: "Cosmos", symbol: "ATOM" },
    { name: "VeChain", symbol: "VET" },
    { name: "TRON", symbol: "TRX" },
    { name: "Fantom", symbol: "FTM" },
    { name: "Elrond", symbol: "EGLD" },
  ];

  const mostPopularCoins = [
    { name: "VeChain", symbol: "VET" },
    { name: "TRON", symbol: "TRX" },
    { name: "Fantom", symbol: "FTM" },
    { name: "Elrond", symbol: "EGLD" },
  ];

  const filteredCoinList = coinList.filter((coin) =>
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCoinSelect = (coin: any) => {
    setCoin(coin);
    setOpenSearch(false);
  };

  return (
    <div className="z-20 absolute max-h-96 bg-[#181D27] rounded-xl w-full p-3 top-16 left-0 space-y-6 overflow-y-scroll">
      <Input
        placeholder="Search asset"
        variant="bordered"
        color="primary"
        size="sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        startContent={
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            color="#AAB3CA"
            id="906"
            className="css-1tksu16"
          >
            <path
              d="M12.9167 11.6667H12.2583L12.025 11.4417C12.8417 10.4917 13.3333 9.25833 13.3333 7.91667C13.3333 4.925 10.9083 2.5 7.91667 2.5C4.925 2.5 2.5 4.925 2.5 7.91667C2.5 10.9083 4.925 13.3333 7.91667 13.3333C9.25833 13.3333 10.4917 12.8417 11.4417 12.025L11.6667 12.2583V12.9167L15.8333 17.075L17.075 15.8333L12.9167 11.6667V11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.99167 4.16667 7.91667C4.16667 5.84167 5.84167 4.16667 7.91667 4.16667C9.99167 4.16667 11.6667 5.84167 11.6667 7.91667C11.6667 9.99167 9.99167 11.6667 7.91667 11.6667Z"
              fill="currentColor"
            ></path>
          </svg>
        }
      />
      <div className="w-full flex justify-start gap-1">
        {mostPopularCoins.map((coin, index) => (
          <Button
            key={index}
            size="sm"
            variant="flat"
            className="flex items-center"
            onClick={() => handleCoinSelect(coin)}
          >
            <Image src={Logo} alt="logo" width={20} height={20} />
            <p className="text-gray-400">{coin.symbol}</p>
          </Button>
        ))}
      </div>
      <div className="w-full flex flex-col gap-2">
        {filteredCoinList.map((coin, index) => (
          <Button
            variant="light"
            key={index}
            className="flex justify-between"
            onClick={() => handleCoinSelect(coin)}
          >
            <div className="flex justify-start gap-2">
              <Image src={Logo} alt="logo" width={20} height={20} />
              <p className="text-gray-400">{coin.symbol}</p>
            </div>
            <p className="text-gray-400 ">0.00</p>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default CoinSearch;
