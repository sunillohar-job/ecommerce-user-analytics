import { useState, useRef, useCallback } from 'react';
import { API_URL } from '../config';
import { nanoid } from 'nanoid';

export interface FetchError<T = any> {
  status: number;
  message: string;
  body?: T;
  isServerError?: boolean;
}

export interface UseFetchResult<T, B = any> {
  data: T | null;
  error: FetchError | null;
  loading: boolean;
  fetchData: (
    options?: RequestInit & {
      body?: B;
      query?: string;
      param?: string;
      reset?: boolean;
    }
  ) => Promise<T | null>;
}

/**
 * Extract readable message from HTML error pages
 */
function parseHtmlError(html: string): string {
  if (html.includes('504 Gateway Timeout')) {
    return 'Server timeout. Please try again later.';
  }
  if (html.includes('503 Service Unavailable')) {
    return 'Service temporarily unavailable.';
  }
  if (html.includes('502 Bad Gateway')) {
    return 'Bad gateway. Server is not responding.';
  }
  if (html.includes('CloudFront')) {
    return 'Service temporarily unavailable.';
  }
  return 'Unexpected server error.';
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
      options?: RequestInit & {
        body?: B;
        query?: string;
        param?: string;
        reset?: boolean;
      }
    ): Promise<T | null> => {
      if (options?.reset) {
        setLoading(false);
        setError(null);
        setData(null);
        return null;
      }

      requestIdRef.current = nanoid();
      const requestId = requestIdRef.current;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

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

        const contentType = res.headers.get('content-type') || '';
        let parsedBody: any = null;
        try {
          if (contentType.includes('application/json')) {
            parsedBody = await res.json();
          } else {
            parsedBody = await res.text();
          }
        } catch {
          parsedBody = null;
        }

        if (!res.ok) {
          let message = 'Request failed';

        if (typeof parsedBody === 'object' && parsedBody?.message) {
            message = parsedBody.message;
          }
          else if (typeof parsedBody === 'string') {
            message = parseHtmlError(parsedBody);
          }

          throw {
            status: res.status,
            message,
            body: parsedBody,
            isServerError: res.status >= 500,
          } as FetchError;
        }

        if (requestId === requestIdRef.current) {
          setData(parsedBody?.data ?? parsedBody);
        }

        return parsedBody?.data ?? parsedBody;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return null;
        }

        if (requestId === requestIdRef.current) {
          setError({
            status: err.status ?? 0,
            message:
              err.message ||
              'Network error. Please check your connection.',
            body: err.body,
            isServerError: err.status >= 500,
          });
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
