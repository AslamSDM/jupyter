"use client";
import React, { useEffect } from 'react';
import axios from 'axios';
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import { BigNumber } from 'bignumber.js';
import Link from 'next/link';

export default function Pools() {
    const [pools, setPools] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    function decodeMantissa(mantissa: string, vdecimals: number,udecimals: number): number {
        const value = Number(mantissa);

        const decimals = 18 + udecimals- vdecimals
        const f = value / Math.pow(10, decimals);
        return Number(f);
    }


    useEffect(() => {
        async function fetchPools() {
            setLoading(true);
            const response = await axios.get('https://testnetapi.venus.io/markets/core-pool?limit=60');
            response.data.result.map((pool:any) => {
                const totalsupply = decodeMantissa(pool.totalSupplyMantissa,8, 0)
                const exchangeRate = decodeMantissa(pool.exchangeRateMantissa,8, 18)
                pool.totalsupplyusd = totalsupply*exchangeRate*Number(pool.tokenPriceCents)
                return pool;
            })
            response.data.result.sort((a:any, b:any) => Number(b.totalsupplyusd) - Number(a.totalsupplyusd));
            setPools(response.data.result);
            setLoading(false);
        }
        fetchPools();
    }, []);
    console.log(pools);
    return (<>
            <div className="flex justify-center">
        <Card className="w-full">
            <CardHeader>Pool</CardHeader>
            <CardBody className='flex flex-col gap-4'>
                <Card className="flex flex-row justify-between">
                    <CardBody className="flex flex-row justify-between">

                    <div className="w-1/4">Name</div>
                    <div className="w-1/4">Total supply</div>
                    <div className="w-1/4">Liquidity</div>
                    <div className="w-1/4">Supply APY</div>
                    <div className="w-1/4">Borrow APY</div>
               </CardBody>
                </Card>
                {pools.map((pool:any) => (
                    <Card >
                        <Link href={`/pool/${pool.address}`}>
                        <CardBody className="flex flex-row justify-between">
                        <div className="w-1/4">{pool.name}</div>
                        <div className="w-1/4">{(pool.totalsupplyusd / 1000000).toLocaleString("US-en")} million</div>
                        <div className="w-1/4">{pool.liquidityCents}</div>
                        <div className="w-1/4">{pool.supplyApy}</div>
                        <div className="w-1/4">{pool.borrowApy}</div>
                        </CardBody>
                        </Link>
                    </Card>))}
            </CardBody>
            </Card>

            </div>
    </>);
}