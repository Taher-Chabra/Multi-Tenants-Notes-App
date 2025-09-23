import { Request, Response, NextFunction } from 'express';

type AsyncFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | void;

const asyncHandler = (fn: AsyncFn) => {
   return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(error => next(error));
   }
}

export default asyncHandler;