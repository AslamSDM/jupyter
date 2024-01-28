import { useState, useEffect } from "react";
import axios from "axios";

function useHistory(id: string) {
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        async function fetchHistory() {
            setLoading(true);
            try {
                const response = await axios.get(
                    "https://testnetapi.venus.io/markets/history",
                    {
                        params: {
                            asset: id,
                        },
                    }
                );
                setHistory(response.data.result);
                console.log(response.data.result);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [id]);

    return { loading, history };
}

export default useHistory;
