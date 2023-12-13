import { Request, Response, NextFunction } from "express"
import { IN_PROD } from "../../../config/app"

export interface ResponseError extends Error {
  status?: number
}

const notFound = async (_req: Request, _res: Response, next: NextFunction) => {
  const error: any = new Error("Not Found")
  error.status = 404
  next(error)
}

const errorHandler = (
  err: ResponseError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err.stack)
  const { retry } = req.query
  if (
    !retry &&
    err.status === 400 &&
    (err.message.includes("checks.state argument is missing") ||
      err.message.includes("state mismatch"))
  ) {
    console.log("redirect for check state error")
    return res.redirect("/?retry=1")
  } else if (
    err.status === 401 &&
    err.message.includes("Not logged in") &&
    process.env.BASE_HOST
  ) {
    return res.redirect(process.env.BASE_HOST as string)
  } else {
    res.status(err.status || 500)
    return res.send({
      error: {
        status: err.status || 500,
        message: err.message || "Something went wrong",
        stack: !IN_PROD ? err.stack : null,
      },
    })
  }
}

export { notFound, errorHandler }
