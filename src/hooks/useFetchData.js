import axios from "axios";
import { useState } from "react";

function useFetchData(url, timeout) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function init() {
    setData([]);
    setLoading(true);
    setLoading(false);
  }

  async function load() {
    init();
    setLoading(true);
    try {
      const result = await axios.fetch(url, { timeout: timeout }).data;
      setData(result);
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  }

  return { data, loading, error, load };
}

export default useFetchData;
