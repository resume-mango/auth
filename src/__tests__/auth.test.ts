import createHttpError from 'http-errors'
import authController from '../api/v1/controllers/auth'
describe('Auth controller', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })
  describe('login controller', () => {
    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
    })
    test('should redirect to /auth endpint', async () => {
      const req: any = {
        query: {
          rm_name: '',
          rm_path: '',
        },
      }
      const res: any = {
        oidc: {
          login: jest.fn(),
        },
      }
      const next: any = jest.fn()

      await authController.login(req, res, next)
      expect(res.oidc.login).toBeCalledWith({
        returnTo: '/auth',
        silent: true,
        authorizationParams: {
          screen: '',
        },
      })
    })
    test('should redirect to "/auth?rm_name=app&rm_path=resume" endpoint', async () => {
      const req: any = {
        query: {
          rm_name: 'app',
          rm_path: '/resume',
        },
      }
      const res: any = {
        oidc: {
          login: jest.fn(),
        },
      }
      const next: any = jest.fn()

      await authController.login(req, res, next)
      expect(res.oidc.login).toBeCalledWith({
        returnTo: '/auth?rm_name=app&rm_path=/resume',
        silent: true,
        authorizationParams: {
          screen: '',
        },
      })
    })
  })
  describe('logout controller', () => {
    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
    })

    test('should fail due to unauthorized', async () => {
      const req: any = {
        oidc: {
          isAuthenticated: jest.fn().mockReturnValue(false),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await authController.logout(req, res, next)

      expect(next).toBeCalledWith(createHttpError(401, 'Not logged in'))
    })
    test('should logout successfully', async () => {
      const req: any = {
        oidc: {
          isAuthenticated: jest.fn().mockReturnValue(true),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { oidc: { logout: jest.fn() }, clearCookie: jest.fn() }
      const next: any = jest.fn()
      await authController.logout(req, res, next)

      expect(res.oidc.logout).toBeCalledTimes(1)
      expect(res.clearCookie).toBeCalledTimes(1)
    })
  })
})
