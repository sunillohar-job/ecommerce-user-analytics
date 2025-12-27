import { useState, useRef, useCallback, useId } from 'react';
import { API_URL } from '../config';
import { nanoid } from 'nanoid';

export interface FetchError<T = any> {
  status: number;
  message: string;
  body?: T;
}

export interface UseFetchResult<T, B = any> {
  data: T | null;
  error: FetchError | null;
  loading: boolean;
  fetchData: (
    options?: RequestInit & { body?: B } & {
      query?: string;
      param?: string;
      reset?: boolean;
    }
  ) => Promise<T>;
}

export function useFetch<T, B = any>(
  url: string,
  baseOptions: RequestInit = {}
): UseFetchResult<T, B> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<FetchError | null>(null);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef<string>('');
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (
      options?: RequestInit & { body?: B } & {
        param?: string;
        query?: string;
        reset?: boolean;
      }
    ): Promise<T> => {
      if (options?.reset) {
        setLoading(false);
        setError(null);
        setData(null);
        return null as any;
      }
      requestIdRef.current = nanoid();
      const requestId = requestIdRef.current;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      setData(null);

      try {
        const res = await fetch(
          API_URL +
            url +
            (options?.param ?? '') +
            (options?.query ? `?${options.query}` : ''),
          {
            ...baseOptions,
            ...options,
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'x-request-id': requestId,
              ...(baseOptions.headers || {}),
              ...(options?.headers || {}),
            },
          }
        );

        const contentType = res.headers.get('content-type');
        const body = contentType?.includes('application/json')
          ? await res.json()
          : await res.text();

        if (!res.ok) {
          throw {
            status: res.status,
            message: body?.message || body || 'Request failed',
            body,
          } as FetchError;
        }
        if (requestId === requestIdRef.current) {
          setData(body?.data);
        }
        return body?.data;
      } catch (err: any) {
        if (err.name !== 'AbortError' && requestId === requestIdRef.current) {
          setError(err);
        }
        throw err;
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [url, baseOptions]
  );

  return {
    data,
    error,
    loading,
    fetchData,
  };
}
