import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import { IN_PROD } from '../../../config/app'
import { parseUser, syncToken, updateUserRef } from '../helpers/user'

export default {
  home: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      let url = process.env.BASE_HOST
      let hostname
      const path = req.query.rm_path?.toString()
      const host = req.query.rm_name?.toString()

      const token = req.oidc.accessToken?.access_token
      const { SID } = req.cookies

      SID && (await syncToken(token as string, SID))

      if (path && host) {
        if (IN_PROD) {
          hostname =
            host === 'app'
              ? 'https://app.resumemango.com'
              : host === 'manage'
              ? 'https://manage.resumemango.com'
              : 'https://www.resumemango.com'
        } else {
          hostname =
            host === 'app'
              ? 'http://localhost:3001'
              : host === 'manage'
              ? 'http://localhost:3002'
              : 'http://localhost:3000'
        }
        url = hostname + path
      }

      res.redirect(url as string)
    } catch (err) {
      next(err)
    }
  },

  initialData: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { SID } = req.cookies

      const isAuth = req.oidc.isAuthenticated()
      if (!isAuth) throw new createHttpError.Unauthorized()

      const { token_type, isExpired, refresh } = req.oidc.accessToken as any

      const user = req.oidc.user
      if (!user) throw new createHttpError.Unauthorized('user not found!')

      const userData = parseUser(user)

      let token = req.oidc.accessToken?.access_token

      if (isExpired()) {
        const { access_token } = await refresh()

        token = access_token
      }

      if (!token || !token_type) throw new createHttpError.Unauthorized()

      if (!userData.ref) {
        const res = await updateUserRef(token, refresh, SID)

        if (res) {
          token = res?.access_token
          userData.ref = res.ref
        }
      }
      res.status(200)
      res.json({
        user: userData,
        token: `${token_type} ${token}`,
      })
    } catch (err) {
      next(err)
    }
  },
  refreshSession: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      if (!req.oidc.isAuthenticated()) throw new createHttpError.Unauthorized()

      const { token_type, refresh } = req.oidc.accessToken as any

      const { access_token } = await refresh()

      if (!access_token)
        throw createHttpError(400, 'failed to refresh session!')
      console.log('refreshed')
      res.status(200)
      res.json(`${token_type} ${access_token}`)
    } catch (err) {
      next(err)
    }
  },
}
