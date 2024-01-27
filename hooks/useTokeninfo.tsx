
import axios from "axios";
import { useEffect, useState } from "react";

const useTokeninfo = (address:string) => {
  const [tokeninfo, setTokeninfo] = useState([]);
  const [loading, setLoading] = useState(false);
    
    useEffect(() => {
      async function fetchData() {
        setLoading(true);
        const res = await fetch("/api/tokeninfo?address="+address);
        const data = await res.json();
        setTokeninfo(data);
        setLoading(false);
      }
      fetchData();
    }, []);
  
    return {tokeninfo, loading};
  };