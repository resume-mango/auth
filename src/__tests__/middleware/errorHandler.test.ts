import createHttpError from 'http-errors'
import { notFound, errorHandler } from '../../api/v1/middlewares/error_handler'
import * as appConfig from '../../config/app'
describe('api/v1/middlewares/error_handler.ts', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('Not found Middleware', async () => {
    const req: any = {}
    const res: any = {}
    const next = (err: any) => {
      expect(err).toBeTruthy()
      expect(err.status).toBe(404)
      expect(err.message).toBe('Not Found')
    }
    await notFound(req, res, next)
  })

  test('Error handler Middlerware with retry', async () => {
    const req: any = { query: { retry: null } }
    const res: any = {
      redirect: jest.fn(),
    }
    const next: any = {}
    const err = createHttpError(400, 'checks.state argument is missing')

    errorHandler(err, req, res, next)
    expect(res.redirect).toBeCalledTimes(1)
  })
  test('Error handler Middlerware with no status', async () => {
    const req: any = { query: { retry: '1' } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
    const next: any = {}
    const err = Error('Error without status')
    const expected = {
      error: {
        message: 'Error without status',
        status: 500,
      },
    }

    errorHandler(err, req, res, next)
    const functionArg = res.send.mock.calls[0][0]
    expect(res.status).toHaveBeenCalledWith(500)
    expect(functionArg).toMatchObject(expected)
    expect(functionArg.error.stack).toBeDefined()
  })
  test('Error handler Middlerware with status', async () => {
    const req: any = { query: { retry: null } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
    const next: any = {}
    const err = createHttpError(400, 'Bad Request')
    const expected = {
      error: {
        message: 'Bad Request',
        status: 400,
      },
    }

    errorHandler(err, req, res, next)
    const functionArg = res.send.mock.calls[0][0]
    expect(res.status).toHaveBeenCalledWith(400)
    expect(functionArg).toMatchObject(expected)
    expect(functionArg.error.stack).toBeDefined()
  })

  test('Error handler Middlerware with IN_PROD variable', async () => {
    ;(appConfig.IN_PROD as any) = true
    const req: any = { query: { retry: null } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
    const next: any = {}
    const err = createHttpError(400, 'Bad Request')

    const expected = {
      error: {
        message: 'Bad Request',
        status: 400,
      },
    }

    errorHandler(err, req, res, next)
    const functionArg = res.send.mock.calls[0][0]
    expect(res.status).toHaveBeenCalledWith(400)
    expect(functionArg).toMatchObject(expected)
    expect(functionArg.error.stack).toBeNull()
  })
})
