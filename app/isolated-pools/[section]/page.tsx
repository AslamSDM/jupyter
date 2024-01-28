"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



const Page = () => {
   
    const { section } = useParams<{ section: string }>();
    const [loading, setLoading] = useState(false);
    const [pool, setPool] = useState([]);
    useEffect(() => {
        async function fetchData() {
          setLoading(true);
          const res = await fetch("/api/isolatedpools?chain=bsctestnet");
          const data = await res.json();
          const pools_json = JSON.parse(data);
          const pool = pools_json.filter((pool: any) => pool.name === section);
          setPool(pool);
          setLoading(false);
        }
        fetchData();
      }, []);

    

    return (
        <div>
        <h1>Isolated Pool</h1>
        <div className="w-full flex flex-col items-center  justify-center bg-[#181d27]">
            {
                Array.isArray(pool[0]?.vTokens) && pool[0]?.vTokens.map((token: any, index: number) => (
                    <>
                    <div className="w-full flex flex-col items-center  justify-center bg-[#181d27]">
                        <Link href={`/isolated-pools/${pool[0]?.name}/${token.vToken}`}>
                            <h1>
                                {token.vToken}
                            </h1>
                        </Link>
                        </div>
                    </>
                ))
            }
        </div>
        </div>
    );
    }

export default Page;