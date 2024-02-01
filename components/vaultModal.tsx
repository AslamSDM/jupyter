import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Divider, Input, Button } from "@nextui-org/react";
import React, { useState } from "react";
import Image from "next/image";

function VaultModal({ isOpen, onOpenChange, title, coin, buttonText }: any) {
  const [amount, setAmount] = useState(0);
  return (
    <Modal isOpen={isOpen} onClose={onOpenChange}>
      <ModalContent className="items-center bg-[#1E2431]">
        <ModalHeader className="text-center text-white">{title}</ModalHeader>
        <Divider />
        <ModalBody className="w-full items-center">
          <form className="w-full flex flex-col gap-8 items-center text-white py-4">
            <Input
              placeholder="0.00"
              variant="bordered"
              type="number"
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
              startContent={
                <Image src={coin.image} alt="logo" width={20} height={20} />
              }
              endContent={
                <Button
                  size="sm"
                  onClick={() => {}}
                  className="bg-[#2D3549] text-white"
                >
                  Max
                </Button>
              }
            />
            <div className="w-full flex justify-between">
              <div className="flex justify-start gap-1">
                <Image src={coin.image} alt="logo" width={20} height={20} />
                <p className="text-gray-400">Available {coin.name}</p>
              </div>
              <p>0 {coin.name}</p>
            </div>

            <Button
              size="lg"
              className="w-full bg-[#2D3549] text-white"
              type="submit"
            >
              {buttonText}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default VaultModal;
