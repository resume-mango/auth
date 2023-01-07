import { Request, Response, NextFunction } from 'express'
import { ResponseError } from './error_handler'

export const emailVerify = (
  err: ResponseError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status === 400 && err.message.includes('email_not_verified')) {
    const userId = err.message.split('email_not_verified:')[1].split(')')[0]

    res.redirect(
      `${process.env.BASE_HOST}/verify-email/${Buffer.from(userId).toString(
        'base64'
      )}`
    )
  } else {
    next(err)
  }
}
