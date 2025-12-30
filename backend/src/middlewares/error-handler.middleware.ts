import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

export interface IAppError {
  message?: string;
  status?: number;
  data?: {
    [key: string]: unknown;
  };
  sourceError?: Error | null;
}

export class AppError extends Error {
  private _status: number;
  private _data: unknown;
  private _sourceError: Error | null;

  constructor(params: IAppError) {
    super(params?.message || 'Internal server error');

    this._status = params?.status || 500;
    this._sourceError = params?.sourceError || null;
    this._data = params?.data;
  }

  get status(): number {
    return this._status;
  }

  get sourceError(): Error | null {
    return this._sourceError;
  }

  get data(): unknown {
    return this._data;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  const message = err?.message || 'Internal server error';
  const statusCode = (err as AppError)?.status || 500;
  logger.error(
    {
      err,
      requestId: req.headers?.['x-request-id'],
      statusCode
    },
    message
  );
  if (err instanceof AppError) {
    res.status(statusCode).json({ message, data: err.data, status: err.status });
  } else {
    res.status(statusCode).json({ message });
  }
}
