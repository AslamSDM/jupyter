"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



const Page = () => {
   
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [pool, setPool] = useState([]);
    useEffect(() => {
        async function fetchData() {
          setLoading(true);
          const res = await fetch("/api/isolatedpools?chain=bsctestnet");
          const data = await res.json();
          const pools_json = JSON.parse(data);
          const pool = pools_json.filter((pool: any) => pool.name === id);
          setPool(pool);
          setLoading(false);
        }
        fetchData();
      }, []);
      console.log(pool);

    

    return (
        <div>
        <h1>Isolated Pool</h1>
        <div className="w-full flex flex-col items-center  justify-center bg-[#181d27]">
            {
                Array.isArray(pool) && pool.map((pool: any, index: number) => (
                    <>
                    </>
                ))
            }
        </div>
        </div>
    );
    }

export default Page;