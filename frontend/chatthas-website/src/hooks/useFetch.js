import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

/**
 * Reusable hook for data fetching
 */
export function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiClient(endpoint)
      .then(resData => {
        if (isMounted) {
          setData(resData);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [endpoint]);

  return { data, loading, error };
}
