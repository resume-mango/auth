import { Request, Response, NextFunction } from "express"
import createHttpError from "http-errors"
// import { IN_PROD } from '../../../config/app'

export default {
  login: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const path = req.query.rm_path?.toString()
      const host = req.query.rm_name?.toString()
      const screen = req.query.screen?.toString() || ""
      const redirectUrl =
        host && path ? `/?rm_name=${host}&rm_path=${path}` : "/"

      res.oidc.login({
        returnTo: redirectUrl,
        silent: true,
        authorizationParams: {
          screen,
        },
      })
    } catch (err) {
      next(err)
    }
  },
  logout: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      if (!req.oidc.isAuthenticated())
        throw new createHttpError.Unauthorized("Not logged in")
      res.oidc.logout({ returnTo: process.env.BASE_HOST })
      res.clearCookie("rm_ia", {
        path: "/",
        domain: process.env.COOKIE_DOMAIN,
      })
    } catch (err) {
      next(err)
    }
  },
}
