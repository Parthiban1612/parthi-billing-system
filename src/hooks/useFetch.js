import { useState, useEffect } from 'react';

import axios from 'axios';
import { useSelector } from 'react-redux';

import { axiosConfig } from '../redux/endpoints';

const useFetch = (config) => {

  const { token } = useSelector(state => state.auth);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!config?.url) return;

    const source = axios.CancelToken.source();

    setLoading(true);
    setError(null);

    axios({
      ...axiosConfig,
      ...config,
      headers: {
        ...axiosConfig.headers,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(err);
          setLoading(false);
        }
      });

    // Cancel request on cleanup
    return () => {
      source.cancel('Request canceled');
    };
  }, [JSON.stringify(config)]); // Re-run if config changes

  return { data, loading, error };
}

export default useFetch;