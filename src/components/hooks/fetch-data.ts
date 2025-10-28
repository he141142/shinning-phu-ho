import { useState, useEffect, useCallback } from "react";

export function UseFetch<T>(endpoint: string, query: string | null, page?: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!query) return; // ✅ Prevent fetching when query is null
    setLoading(true);
    setError(null);
    
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal, // ✅ Attach signal to allow cancellation
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setData(result.data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort(); // ✅ Cleanup: cancel fetch request on unmount
  }, [endpoint, query, page]); // ✅ Memoize function

  useEffect(() => {
    fetchData();
  }, [fetchData]); // ✅ Only re-fetch if function changes

  return { data, loading, error, refetch: fetchData }; // ✅ Expose `refetch` function
}
