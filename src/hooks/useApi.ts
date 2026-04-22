import { useState, useCallback, useRef, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import apiClient from '@/lib/apiClient';
import { toast } from '@/components/shared/Toast';

interface QueryOptions extends AxiosRequestConfig {
  url: string;
  isSilent?: boolean;
  onSuccess?: (data: any) => void;
  onFail?: (error: any) => void;
}

export const useGetQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getQuery = useCallback(async (options: QueryOptions) => {
    const { url, isSilent, onSuccess, onFail, ...config } = options;
    
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await apiClient.get(url, config);
      
      // Enforce minimum 800ms loading state to prevent skeleton flash (Rule A5)
      const duration = Date.now() - startTime;
      if (duration < 800) {
        await new Promise((resolve) => setTimeout(resolve, 800 - duration));
      }

      if (isMounted.current) {
        setData(response.data);
        setError(null);
        onSuccess?.(response.data);
      }
      return response.data;
    } catch (err: any) {
      if (axios.isCancel(err)) return;

      if (isMounted.current) {
        setError(err);
        if (!isSilent) {
          toast.error(err.message || 'Something went wrong');
        }
        onFail?.(err);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  return { loading, data, error, getQuery };
};

export const usePostQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const postQuery = useCallback(async (options: QueryOptions & { body?: any }) => {
    const { url, body, isSilent, onSuccess, onFail, ...config } = options;
    
    setLoading(true);
    try {
      const response = await apiClient.post(url, body, config);
      if (isMounted.current) {
        setData(response.data);
        setError(null);
        onSuccess?.(response.data);
      }
      return response.data;
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      if (isMounted.current) {
        setError(err);
        if (!isSilent) {
          toast.error(err.message || 'Something went wrong');
        }
        onFail?.(err);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  return { loading, data, error, postQuery };
};

export const usePatchQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const patchQuery = useCallback(async (options: QueryOptions & { body?: any }) => {
    const { url, body, isSilent, onSuccess, onFail, ...config } = options;
    
    setLoading(true);
    try {
      const response = await apiClient.patch(url, body, config);
      if (isMounted.current) {
        setData(response.data);
        setError(null);
        onSuccess?.(response.data);
      }
      return response.data;
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      if (isMounted.current) {
        setError(err);
        if (!isSilent) {
          toast.error(err.message || 'Something went wrong');
        }
        onFail?.(err);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  return { loading, data, error, patchQuery };
};

export const useDeleteQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const deleteQuery = useCallback(async (options: QueryOptions) => {
    const { url, isSilent, onSuccess, onFail, ...config } = options;
    
    setLoading(true);
    try {
      const response = await apiClient.delete(url, config);
      if (isMounted.current) {
        setData(response.data);
        setError(null);
        onSuccess?.(response.data);
      }
      return response.data;
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      if (isMounted.current) {
        setError(err);
        if (!isSilent) {
          toast.error(err.message || 'Something went wrong');
        }
        onFail?.(err);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  return { loading, data, error, deleteQuery };
};
