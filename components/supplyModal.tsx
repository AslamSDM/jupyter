"use client";
import { useParams } from "next/navigation";
import { useContractRead, useContractWrite, useSendTransaction } from "wagmi";
import { vTokenabi } from "@/components/abi/vTokenabi";
import { vBNBTokenabi } from "@/components/abi/vBNBTokenabi";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";

import SupplyTab from "./supplyTab";
import Borrowtab from "./borrowtab";
import WithdrawTab from "./withdrawTab";
import RepayTab from "./repayTab";

function SupplyModal({
  isOpen,
  onOpenChange,
  pool,
  selectedTab,
  setSelectedTab,
}: any) {
  const { id } = useParams();

  function decodeMantissa(
    mantissa: string,
    vdecimals: number,
    udecimals: number
  ): number {
    const value = Number(mantissa);

    const decimals = 18 + udecimals - vdecimals;
    const f = value / Math.pow(10, decimals);
    return Number(f);
  }

  const totalsupply = decodeMantissa(pool.totalSupplyMantissa, 8, 0);
  const exchangeRate = decodeMantissa(pool.exchangeRateMantissa, 8, 18);
  const totalsupplyusd =
    totalsupply * exchangeRate * Number(pool.tokenPriceCents);

  const { write: mint } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "mint",
  });
  const { write: mintBNB } = useContractWrite({
    address: id as `0x${string}`,
    abi: vBNBTokenabi,
    functionName: "mint",
  });

  const { write: approve } = useContractWrite({
    address: pool.underlyingAddress as `0x${string}`,
    abi: vTokenabi,
    functionName: "approve",
  });
  const { data: allowance } = useContractRead({
    address: pool.underlyingAddress as `0x${string}`,
    abi: vTokenabi,
    functionName: "allowance",
  });
  const { write: approveVtoken } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "approve",
  });
  const { write: borrow } = useContractWrite({
    address: id as `0x${string}`,
    abi: vBNBTokenabi,
    functionName: "borrow",
  });
  const { write: redeem } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "redeemUnderlying",
  });
  const { write: repay } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "repayBorrow",
  });

  return (
    <Modal isOpen={isOpen} onClose={onOpenChange}>
      <ModalContent className="items-center bg-[#1E2431]">
        <ModalHeader className="text-center text-white">
          {pool.name}
        </ModalHeader>
        <Divider />
        <ModalBody className="w-full items-center">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            variant="light"
            size="lg"
            color="primary"
          >
            <Tab key="supply" className="w-full" title="Supply">
              <SupplyTab
                pool={pool}
                id={id}
                mint={mint}
                approve={approve}
                mintBNB={mintBNB}
              />
            </Tab>
            <Tab key="withdraw" className="w-full" title="Withdraw">
              <WithdrawTab
                pool={pool}
                approveVtoken={approveVtoken}
                redeem={redeem}
                id={id}
              />
            </Tab>
            <Tab key="borrow" className="w-full" title="Borrow">
              <Borrowtab pool={pool} borrow={borrow} />
            </Tab>
            <Tab key="repay" className="w-full" title="Repay">
              <RepayTab pool={pool} repay={repay} approve={approve} id={id} />
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SupplyModal;
