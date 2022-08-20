import privateController from '../api/v1/controllers/private'
describe('Private Controller', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })
  describe('Token controller', () => {
    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
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

          isAuthenticated: jest.fn().mockReturnValue(false),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await privateController.token(req, res, next)

      expect(next).toBeCalledWith(Error('Unauthorized'))
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

          isAuthenticated: jest.fn().mockReturnValue(true),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await privateController.token(req, res, next)
      expect(req.oidc.accessToken.isExpired).toBeCalled()
      expect(req.oidc.accessToken.refresh).toBeCalled()
      expect(next).toBeCalledWith(Error('Unauthorized'))
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
            refresh: jest.fn().mockResolvedValue({ access_token: 'abc' }),
          },

          isAuthenticated: jest.fn().mockReturnValue(true),
        },
        cookies: { SID: 'snxnz' },
      }
      const res: any = { status: jest.fn(), json: jest.fn() }
      const next: any = jest.fn()
      await privateController.token(req, res, next)
      expect(req.oidc.accessToken.isExpired).toBeCalled()
      expect(req.oidc.accessToken.refresh).toBeCalled()
      expect(res.status).toBeCalledWith(200)
      expect(res.json).toBeCalledWith({ token_type: 'bearer', token: 'abc' })
    })
  })
})
