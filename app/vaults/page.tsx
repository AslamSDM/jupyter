"use client";
import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useDisclosure } from "@nextui-org/react";
import getImage from "@/components/abi/tokenImage";
import VaultModal from "@/components/vaultModal";

function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalTitle, setModalTitle] = useState("");
  const [modalCoin, setModalCoin] = useState({});
  const [modalButtonText, setModalButtonText] = useState("");

  const xvsImage = getImage("vXVS");
  const vaiImage = getImage("Venus ETH");

  const handleStakeXVS = () => {
    setModalTitle("Stake XVS");
    setModalCoin({
      name: "XVS",
      image: xvsImage,
    });
    setModalButtonText("Enter a valid amount to Stake");
    onOpenChange();
  };

  const handleWithdrawXVS = () => {
    setModalTitle("Withdraw XVS");
    setModalCoin({
      name: "XVS",
      image: xvsImage,
    });
    setModalButtonText("Enter a valid amount to Withdraw");
    onOpenChange();
  };

  const handleStakeVAI = () => {
    setModalTitle("Stake VAI");
    setModalCoin({
      name: "VAI",
      image: vaiImage,
    });
    setModalButtonText("Enter a valid amount to Stake");
    onOpenChange();
  };

  const handleWithdrawVAI = () => {
    setModalTitle("Withdraw VAI");
    setModalCoin({
      name: "VAI",
      image: vaiImage,
    });
    setModalButtonText("Enter a valid amount to Withdraw");
    onOpenChange();
  };

  return (
    <div className="w-full flex flex-col gap-10 px-10 py-8">
      <div className="flex justify-between">
        <h2 className="text-2xl text-white font-bold">Vaults</h2>
        <ConnectButton />
      </div>
      <div className="w-full flex justify-between">
        <div className="w-[47%] rounded-xl bg-[#1E2431] p-6 flex flex-col gap-8 justify-between items-start">
          <div className="flex justify-start items-center gap-2">
            <Image
              src={xvsImage}
              alt="Jupiter"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            <p className="text-white text-xl font-bold">XVS</p>
          </div>
          <p className="text-gray-400 text-sm">You are staking</p>
          <div className="flex justify-start items-center gap-4">
            <Image
              src={xvsImage}
              alt="Jupiter"
              className="w-9 h-9"
              width={20}
              height={20}
            />
            <p className="text-white text-5xl font-bold">0</p>
          </div>
          <div className="flex justify-start">
            <div className="flex flex-col gap-2">
              <p className="text-gray-400 text-sm">XVS Stake APR</p>
              <p className="text-white text-xl font-bold">8.72%</p>
            </div>
            <div className="flex flex-col gap-2 border-x border-gray-600 px-4 mx-4">
              <p className="text-gray-400 text-sm">Daily Emission</p>
              <p className="text-white text-xl font-bold">8.72%</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-400 text-sm">Total Stake</p>
              <p className="text-white text-xl font-bold">8.72%</p>
            </div>
          </div>
          <div className="w-full flex gap-8">
            <button
              onClick={handleStakeXVS}
              className="h-12 basis-1/2 py-2 px-6 rounded-lg bg-blue-600"
            >
              Supply
            </button>
            <button
              onClick={handleWithdrawXVS}
              className="h-12 basis-1/2 py-2 px-6 rounded-lg border border-blue-600"
            >
              Withdraw
            </button>
          </div>
        </div>
        <div className="w-[47%] rounded-xl bg-[#1E2431] p-6 flex flex-col gap-8 justify-between items-start">
          <div className="flex justify-start items-center gap-2">
            <Image
              src={vaiImage}
              alt="Jupiter"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            <p className="text-white text-xl font-bold">VAI</p>
          </div>
          <p className="text-gray-400 text-sm">You are staking</p>
          <div className="flex justify-start items-center gap-4">
            <Image
              src={vaiImage}
              alt="Jupiter"
              className="w-9 h-9"
              width={20}
              height={20}
            />
            <p className="text-white text-5xl font-bold">0</p>
          </div>
          <div className="flex justify-start">
            <div className="flex flex-col gap-2">
              <p className="text-gray-400 text-sm">VAI Stake APR</p>
              <p className="text-white text-xl font-bold">8.72%</p>
            </div>
            <div className="flex flex-col gap-2 border-x border-gray-600 px-4 mx-4">
              <p className="text-gray-400 text-sm">Daily Emission</p>
              <p className="text-white text-xl font-bold">8.72%</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-400 text-sm">Total Stake</p>
              <p className="text-white text-xl font-bold">8.72%</p>
            </div>
          </div>
          <div className="w-full flex gap-8">
            <button
              onClick={handleStakeVAI}
              className="h-12 basis-1/2 py-2 px-6 rounded-lg bg-blue-600"
            >
              Supply
            </button>
            <button
              onClick={handleWithdrawVAI}
              className="h-12 basis-1/2 py-2 px-6 rounded-lg border border-blue-600"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
      <VaultModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={modalTitle}
        coin={modalCoin}
        buttonText={modalButtonText}
      />
    </div>
  );
}

export default Page;
