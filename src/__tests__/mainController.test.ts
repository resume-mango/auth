// import app from '../../app'
// import authService from 'express-openid-connect'
import * as helpers from '../api/v1/helpers/user'
// import { auth0Token } from '../../__mocks__/token'
import * as config from '../config/app'
import mainController from '../api/v1/controllers/main'
import { fakeUser } from '../__mocks__/auth0User'

describe('Main Controller Apis', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('Home controller', () => {
    test('Should redirect to on localhost:3001', async () => {
      const syncSpy = jest.spyOn(helpers, 'syncToken')
      syncSpy.mockResolvedValueOnce(false)
      const req: any = {
        query: {
          rm_name: 'app',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: { access_token: 'token' },
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { redirect: jest.fn() }
      const next: any = jest.fn()
      await mainController.home(req, res, next)

      expect(res.redirect).toBeCalledWith('http://localhost:3001/abc')
    })
    test('Should redirect to on localhost:3002', async () => {
      const syncSpy = jest.spyOn(helpers, 'syncToken')
      syncSpy.mockResolvedValueOnce(false)
      const req: any = {
        query: {
          rm_name: 'manage',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: { access_token: 'token' },
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { redirect: jest.fn() }
      const next: any = jest.fn()
      await mainController.home(req, res, next)

      expect(res.redirect).toBeCalledWith('http://localhost:3002/abc')
    })
    test('Should redirect to on localhost:3001 due to invalid query name', async () => {
      const syncSpy = jest.spyOn(helpers, 'syncToken')
      syncSpy.mockResolvedValueOnce(false)
      const req: any = {
        query: {
          rm_name: 'fds',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: { access_token: 'token' },
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { redirect: jest.fn() }
      const next: any = jest.fn()
      await mainController.home(req, res, next)

      expect(res.redirect).toBeCalledWith('http://localhost:3001/abc')
    })
    test('Should redirect to on app.resumemango.com', async () => {
      Object.defineProperties(config, { IN_PROD: { value: true } })
      const syncSpy = jest.spyOn(helpers, 'syncToken')
      syncSpy.mockResolvedValueOnce(false)

      const req: any = {
        query: {
          rm_name: 'app',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: { access_token: 'token' },
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { redirect: jest.fn() }
      const next: any = jest.fn()
      await mainController.home(req, res, next)

      expect(res.redirect).toBeCalledWith('https://app.resumemango.com/abc')
    })
    test('Should redirect to on manage.resumemango.com', async () => {
      Object.defineProperties(config, { IN_PROD: { value: true } })
      const syncSpy = jest.spyOn(helpers, 'syncToken')
      syncSpy.mockResolvedValueOnce(false)
      const req: any = {
        query: {
          rm_name: 'manage',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: { access_token: 'token' },
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { redirect: jest.fn() }
      const next: any = jest.fn()
      await mainController.home(req, res, next)

      expect(res.redirect).toBeCalledWith('https://manage.resumemango.com/abc')
    })
    test('Should redirect to on app.resumemango.com due to invalid query', async () => {
      Object.defineProperties(config, { IN_PROD: { value: true } })
      const syncSpy = jest.spyOn(helpers, 'syncToken')
      syncSpy.mockResolvedValueOnce(false)
      const req: any = {
        query: {
          rm_name: 'asd',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: { access_token: 'token' },
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { redirect: jest.fn() }
      const next: any = jest.fn()
      await mainController.home(req, res, next)

      expect(res.redirect).toBeCalledWith('https://app.resumemango.com/abc')
    })
  })
  describe('Initail Data controller', () => {
    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
    })
    test('should fail due to unauthorized', async () => {
      const req: any = {
        query: {
          rm_name: 'asd',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: { access_token: 'token' },
          isAuthenticated: jest.fn().mockReturnValue(false),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await mainController.initialData(req, res, next)

      expect(next).toBeCalledWith(Error('Unauthorized'))
    })
    test('should fail due to user not found', async () => {
      const req: any = {
        query: {
          rm_name: 'asd',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: {
            token_type: 'bearer',
            isExpired: 'false',
            refresh: jest.fn(),
          },
          isAuthenticated: jest.fn().mockReturnValue(true),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await mainController.initialData(req, res, next)

      expect(next).toBeCalledWith(Error('user not found!'))
    })

    test('should fail due to no token', async () => {
      const req: any = {
        query: {
          rm_name: 'asd',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: {
            token_type: 'bearer',
            isExpired: jest.fn().mockReturnValue(true),
            refresh: jest.fn().mockResolvedValue({ access_token: undefined }),
          },
          user: fakeUser(),
          isAuthenticated: jest.fn().mockReturnValue(true),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await mainController.initialData(req, res, next)
      expect(req.oidc.accessToken.isExpired).toBeCalled()
      expect(req.oidc.accessToken.refresh).toBeCalled()
      expect(next).toBeCalledWith(Error('Unauthorized'))
    })
    test('should update user ref and succesfully return user data', async () => {
      const updateUserRefSpy = jest.spyOn(helpers, 'updateUserRef')
      updateUserRefSpy.mockResolvedValueOnce({
        access_token: 'new-token',
        ref: 'new-ref',
      })
      const req: any = {
        query: {
          rm_name: 'asd',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: {
            token_type: 'bearer',
            isExpired: jest.fn().mockReturnValue(true),
            refresh: jest.fn().mockResolvedValue({ access_token: 'abc' }),
          },
          user: fakeUser(),
          isAuthenticated: jest.fn().mockReturnValue(true),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await mainController.initialData(req, res, next)
      expect(req.oidc.accessToken.isExpired).toBeCalled()
      expect(req.oidc.accessToken.refresh).toBeCalled()
      expect(res.status).toBeCalledWith(200)
      expect(res.json).toBeCalledTimes(1)
    })
  })
  describe('Refresh Session controller', () => {
    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
    })

    test('should fail due to unauthorized', async () => {
      const req: any = {
        query: {
          rm_name: 'asd',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: { access_token: 'token' },
          isAuthenticated: jest.fn().mockReturnValue(false),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await mainController.refreshSession(req, res, next)

      expect(next).toBeCalledWith(Error('Unauthorized'))
    })
    test('should fail to refresh session!', async () => {
      const req: any = {
        query: {
          rm_name: 'asd',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: {
            token_type: 'bearer',
            refresh: jest.fn().mockResolvedValue({ access_token: '' } as any),
          },
          isAuthenticated: jest.fn().mockReturnValue(true),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await mainController.refreshSession(req, res, next)

      expect(next).toBeCalledWith(Error('failed to refresh session!'))
    })
    test('should fail to refresh session!', async () => {
      const req: any = {
        query: {
          rm_name: 'asd',
          rm_path: '/abc',
        },
        oidc: {
          accessToken: {
            token_type: 'bearer',
            refresh: jest.fn().mockResolvedValue({ access_token: 'abc' }),
          },
          isAuthenticated: jest.fn().mockReturnValue(true),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await mainController.refreshSession(req, res, next)
      expect(res.status).toBeCalledWith(200)
      expect(res.json).toBeCalledWith('bearer abc')
    })
  })
})
