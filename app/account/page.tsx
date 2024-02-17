import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, Chip, Link } from "@nextui-org/react";

function page() {
  return (
    <div className="w-full flex flex-col gap-8 px-10 py-8">
      <div className="flex justify-between">
        <h2 className="text-xl text-white font-bold">Account</h2>
        <ConnectButton />
      </div>
      <h2 className="text-xl text-white font-bold">Summary</h2>
      <div className="w-full rounded-xl bg-[#1E2431] flex justify-start gap-10 p-6 font-semibold text-xl">
        <div className="flex flex-col">
          <p className="text-gray-400">Net APY</p>
          <p className="text-green-400">100</p>
        </div>
        <div className="h-full w-px bg-gray-600"></div>
        <div className="flex flex-col">
          <p className="text-gray-400">Daily Earnings</p>
          <p className="text-white">100</p>
        </div>
        <div className="h-full w-px bg-gray-600"></div>
        <div className="flex flex-col">
          <p className="text-gray-400">Total Supply</p>
          <p className="text-white">100</p>
        </div>
        <div className="h-full w-px bg-gray-600"></div>
        <div className="flex flex-col">
          <p className="text-gray-400">Total Borrow</p>
          <p className="text-white">100</p>
        </div>
        <div className="h-full w-px bg-gray-600"></div>
        <div className="flex flex-col">
          <p className="text-gray-400">Total Vault Stake</p>
          <p className="text-white">100</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-xl text-white font-bold">Pools</h2>
        <Button
          href="/core-pool"
          as={Link}
          color="primary"
          radius="full"
          size="sm"
        >
          Venus Core Pool
        </Button>
      </div>
      <h2 className="text-xl text-white font-bold">Summary</h2>
      <div className="w-full rounded-xl bg-[#1E2431] flex justify-between p-6 font-semibold text-xl">
        <div className="flex justify-start gap-10">
          <div className="flex flex-col">
            <p className="text-gray-400">Net APY</p>
            <p className="text-green-400">100</p>
          </div>
          <div className="h-full w-px bg-gray-600"></div>
          <div className="flex flex-col">
            <p className="text-gray-400">Daily Earnings</p>
            <p className="text-white">100</p>
          </div>
          <div className="h-full w-px bg-gray-600"></div>
          <div className="flex flex-col">
            <p className="text-gray-400">Total Supply</p>
            <p className="text-white">100</p>
          </div>
          <div className="h-full w-px bg-gray-600"></div>
          <div className="flex flex-col">
            <p className="text-gray-400">Total Borrow</p>
            <p className="text-white">100</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-8">
            <p className="text-gray-400 text-sm">
              Borrow Limit used: <span className="text-white">0%</span>
            </p>
            <p className="text-gray-400 text-sm">
              Limit: <span className="text-white">$8.20</span>
            </p>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-red-600 h-2.5 dark:bg-blue-500 absolute w-1"
              style={{ left: "85%" }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm text-end">
            Your safe limit: <span className="text-white">0%</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
