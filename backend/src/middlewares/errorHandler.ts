import { Request, Response, NextFunction } from 'express';

export interface IAppError {
  message?: string;
  status?: number;
  data?: {
    [key: string]: any;
  };
  sourceError?: Error | null;
}

export class AppError extends Error {
  private _status: number;
  private _data: any;
  private _sourceError: Error | null;

  constructor(params: IAppError) {
    super(params?.message! || 'Internal server error');

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

  get data(): any {
    return this._data;
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message, data: err.data, status: err.status });
  } else {
    res.status(500).json({ message: err?.message || 'Internal server error' });
  }
}
