import { useEffect, useState } from "react"

const API = 'https://bot.fuse.io/api/v1';

const getSupplyStats = async () => {
  const response = await fetch(`${API}/stats/circulatingVolt`, {
    method: "GET"
  });
  return response.json();
};

const useSupplyStats = () => {
  const [stats, setStats] = useState({ circSupply: undefined, totalSupply: undefined });
  const [isLoading, setLoading] = useState();
  const [error, setError] = useState();
  
  useEffect(async () => {
    setLoading(true);
    try {
      const res = await getSupplyStats();
      setStats(res);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  }, []);
  
  return [stats, { isLoading, error }];
};

export default useSupplyStats;
