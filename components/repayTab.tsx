import Image from "next/image";
import { useState } from "react";
import Logo from "../assets/logo.svg";
import { Input, Button, Divider } from "@nextui-org/react";
import { ethers } from "ethers";

function RepayTab({ pool, id, repay, approve }: any) {
  const [amount, setAmount] = useState(0);

  const handleRepay = async (e: any) => {
    e.preventDefault();
    approve({
      args: [id, ethers.parseUnits(amount.toString(), pool.underlyingDecimal)],
    });
    repay({
      args: [ethers.parseUnits(amount.toString(), pool.underlyingDecimal)],
    });
  };
  return (
    <form
      className="flex flex-col gap-3 items-center text-white"
      onSubmit={handleRepay}
    >
      <div className="w-full flex justify-between">
        <p className="text-gray-400">Currently borrowing</p>
        <p>{`0 ${pool.name}`}</p>
      </div>
      <Input
        placeholder="0.00"
        variant="bordered"
        type="number"
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
        startContent={<Image src={Logo} alt="logo" width={20} height={20} />}
        endContent={
          // <div className="flex items-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {}}
              className="bg-[#2D3549] text-white"
            >
              <Image src={Logo} alt="logo" width={20} height={20} />
              {pool.name}
              <svg
                fill="#FFFF"
                height="200px"
                width="200px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 330 330"
                xmlSpace="preserve"
                stroke="#FFFF"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    id="XMLID_225_"
                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                  ></path>{" "}
                </g>
              </svg>
            </Button>
            <Button
              size="sm"
              onClick={() => {}}
              className="bg-[#2D3549] text-white"
            >
              Max
            </Button>
          </div>
        }
      />
      <div className="flex gap-8">
        <Button
          size="sm"
          variant="flat"
          color="primary"
          className="rounded-3xl"
        >
          25%
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="primary"
          className="rounded-3xl"
        >
          50%
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="primary"
          className="rounded-3xl"
        >
          75%
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="primary"
          className="rounded-3xl"
        >
          100%
        </Button>
      </div>
      {/* </ButtonGroup> */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between">
          <p className="text-gray-400">Wallet balance</p>
          <p>{`0 ${pool.name}`}</p>
        </div>
        <Divider className="my-4 bg-gray-600" />
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={Logo} alt="logo" width={20} height={20} />
            <p className="text-gray-400">Supply APY</p>
          </div>
          <p>0.02%</p>
        </div>
        <div className="flex justify-between">
          <div className="flex justify-start gap-1">
            <Image src={Logo} alt="logo" width={20} height={20} />
            <p className="text-gray-400">Distribution APY (XVS)</p>
          </div>
          <p>0.02%</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Supply APY</p>
          <p>0.02%</p>
        </div>
        <Divider className="my-4 bg-gray-600" />
        <div className="flex justify-between">
          <p className="text-gray-400">{`Current : $0`}</p>
          <p>Max 0.02%</p>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className="bg-red-600 h-2.5 dark:bg-blue-500 absolute w-1"
            style={{ left: "85%" }}
          ></div>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">{`Borrow Balance (${pool.name})`}</p>
          <p>0.02%</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Borrow limit used</p>
          <p>0.02%</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Daily earnings</p>
          <p>0.02%</p>
        </div>
      </div>
      <Button
        variant="bordered"
        color="primary"
        className="w-full"
        type="submit"
      >
        Enter a valid amount to repay
      </Button>
    </form>
  );
}

export default RepayTab;
