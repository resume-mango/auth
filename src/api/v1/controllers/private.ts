import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'

export default {
  token: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const isAuth = req.oidc.isAuthenticated()
      if (!isAuth) throw new createHttpError.Unauthorized()
      const { token_type, isExpired, refresh } = req.oidc.accessToken as any

      let token = req.oidc.accessToken?.access_token

      if (isExpired()) {
        const { access_token } = await refresh()
        token = access_token
      }
      if (!token || !token_type) throw new createHttpError.Unauthorized()
      res.status(200)
      res.json({ token_type, token })
    } catch (err) {
      next(err)
    }
  },
}
