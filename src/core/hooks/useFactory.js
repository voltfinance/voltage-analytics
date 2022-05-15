import { useEffect, useState } from "react";
import { getFactory } from "../api";
import { useApollo } from "../apollo";

const useFactory = () => {
  const [stats, setStats] = useState({});
  const [isLoading, setLoading] = useState();
  const [error, setError] = useState();
  const client = useApollo()

  useEffect(async () => {
    setLoading(true);
    try {
      const res = await getFactory(client);
      setStats(res);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  }, []);

  return [stats, { isLoading, error }];
};

export default useFactory;
