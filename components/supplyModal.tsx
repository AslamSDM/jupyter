"use client";
import { useParams } from "next/navigation";
import { useAccount, useBalance, useContractRead, useContractWrite, useSendTransaction } from "wagmi";
import { vTokenabi } from "@/components/abi/vTokenabi";
import { vBNBTokenabi } from "@/components/abi/vBNBTokenabi";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";

import SupplyTab from "./supplyTab";
import Borrowtab from "./borrowtab";
import WithdrawTab from "./withdrawTab";
import RepayTab from "./repayTab";
import { newcomptrollerabi, oldecomptrollerabi } from "./abi/comptrollerabi";

function SupplyModal({
  isOpen,
  onOpenChange,
  pool,
  selectedTab,
  setSelectedTab,
  poolType,
}: any) {
  const { id } = useParams();
  
  const {isConnected,address} = useAccount()
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
  
  const { data: comptroller ,error:Comperror} = useContractRead({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "comptroller",
  });
  const totalsupply = decodeMantissa(pool.totalSupplyMantissa, 8, 0);
  const exchangeRate = decodeMantissa(pool.exchangeRateMantissa, 8, 18);
  const totalsupplyusd = totalsupply * exchangeRate * Number(pool.tokenPriceCents);
//facet fn for core pool
// const {data:MembershipFacet}  = useContractRead({
//   address: comptroller as `0x${string}`,
//   abi: oldecomptrollerabi,
//   functionName:"facetAddress",
//   args:["0xc2998238"]
// })
  //comptroller fn 
  const { write: enterMarket } = useContractWrite({
    address:  comptroller as `0x${string}`,
    abi: newcomptrollerabi,
    functionName: "enterMarkets",
    args: [[id as `0x${string}`]],
  });
  const { write: exitMarket } = useContractWrite({
    address:  comptroller as `0x${string}`,
    abi: newcomptrollerabi,
    functionName: "exitMarket",
    args: [id as `0x${string}`],
  });
  const {data:Membership } = useContractRead({
    address:  comptroller as `0x${string}`,
    abi:newcomptrollerabi,
    functionName:"checkMembership",
    args:[address as `0x${string}`,id as `0x${string}`]
  })
  const {data:accountLiquidity} = useContractRead({
    address:  comptroller as `0x${string}`,
    abi:newcomptrollerabi,
    functionName:"getAccountLiquidity",
    args:[address as `0x${string}`]
  })
  const borrowPower = useContractRead({
    address:  comptroller as `0x${string}`,
    abi:newcomptrollerabi,
    functionName:"getBorrowingPower",
    args:[address as `0x${string}`]
  })
  //Vtoken fn

const {data:underlyingbalance,refetch:underlyingbalancerefresh} = useBalance({ address:address,token: pool.underlyingAddress }  );
const {data:vtokenbalance,refetch:vtokenbalancerefetch} = useBalance({address:address, token: id as `0x${string}` }  );

  const { write: mint } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "mint",
    onSuccess: () => {
      refetchbalance();
    }
  });
  const { write: mintBNB } = useContractWrite({
    address: id as `0x${string}`,
    abi: vBNBTokenabi,
    functionName: "mint",
    onSuccess: () => {
      refetchbalance();
    }
  });

  const { write: approve } = useContractWrite({
    address: pool.underlyingAddress as `0x${string}`,
    abi: vTokenabi,
    functionName: "approve",
    onSuccess: () => {
      allowance.refetch();
      refetchbalance();
    },
  });
  const allowance  = useContractRead({
    address: pool.underlyingAddress as `0x${string}`,
    abi: vTokenabi,
    functionName: "allowance",
    args:[address as `0x${string}`,id as `0x${string}`]
  });
  const {data:borrowBalance , refetch:borrowBalancerefetch}  = useContractRead({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "borrowBalanceStored",
    args:[address as `0x${string}`]
  });
  const { write: approveVtoken } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "approve",
  });
  const allowanceVtoken  = useContractRead({
    address: pool.underlyingAddress as `0x${string}`,
    abi: vTokenabi,
    functionName: "allowance",
    args:[address as `0x${string}`,id as `0x${string}`]
  });
  const { write: borrow } = useContractWrite({
    address: id as `0x${string}`,
    abi: vBNBTokenabi,
    functionName: "borrow",
    onSuccess: () => {
      refetchbalance();
    }
  });
  const { write: redeem } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "redeemUnderlying",
    onSuccess: () => {
      refetchbalance();
    }
  });
  const { write: repay } = useContractWrite({
    address: id as `0x${string}`,
    abi: vTokenabi,
    functionName: "repayBorrow",
    onSuccess: () => {
      refetchbalance();
      borrowBalancerefetch();
    }
  });
  const refetchbalance = () => {
    underlyingbalancerefresh();
    vtokenbalancerefetch();
  }
  const marketHandler = async () => {
    if(Membership == false){
      await enterMarket();
    }
    else{
      await exitMarket();
    }
  }

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
                isConnected={isConnected}
                mint={mint}
                approve={approve}
                mintBNB={mintBNB}
                marketHandler={marketHandler}
                Membership={Membership}
                vtokenbalance={vtokenbalance}
                underlyingbalance={underlyingbalance}
                borrowPower={borrowPower}
                accountLiquidity={accountLiquidity}
                borrowBalance={borrowBalance}
                allowance={allowance}
                refetchbalance= {refetchbalance}
                />
            </Tab>
            <Tab key="withdraw" className="w-full" title="Withdraw">
              <WithdrawTab
                pool={pool}
                id={id}
                isConnected={isConnected}
                mint={mint}
                mintBNB={mintBNB}
                marketHandler={marketHandler}
                Membership={Membership}
                vtokenbalance={vtokenbalance}
                underlyingbalance={underlyingbalance}
                borrowPower={borrowPower}
                accountLiquidity={accountLiquidity}
                borrowBalance={borrowBalance}
                allowance={allowanceVtoken}
                refetchbalance= {refetchbalance}
                approve={approveVtoken}
                redeem={redeem}
                />
            </Tab>
            <Tab key="borrow" className="w-full" title="Borrow">
              <Borrowtab pool={pool} borrow={borrow} 
                id={id}
                isConnected={isConnected}
                approve={approve}
                mintBNB={mintBNB}
                marketHandler={marketHandler}
                Membership={Membership}
                vtokenbalance={vtokenbalance}
                underlyingbalance={underlyingbalance}
                borrowPower={borrowPower}
                accountLiquidity={accountLiquidity}
                borrowBalance={borrowBalance}
                allowance={allowance}
                refetchbalance= {refetchbalance}
                />
            </Tab>
            <Tab key="repay" className="w-full" title="Repay">
              <RepayTab pool={pool} repay={repay} approve={approve} id={id} 
              isConnected={isConnected}
              mint={mint}
              mintBNB={mintBNB}
              marketHandler={marketHandler}
              Membership={Membership}
              vtokenbalance={vtokenbalance}
              underlyingbalance={underlyingbalance}
              borrowPower={borrowPower}
              accountLiquidity={accountLiquidity}
              borrowBalance={borrowBalance}
              allowance={allowance}
              refetchbalance= {refetchbalance}
              
              />
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SupplyModal;
