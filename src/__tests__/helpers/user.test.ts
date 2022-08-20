import axios from 'axios'
import { parseUser, syncToken, updateUserRef } from '../../api/v1/helpers/user'
import { fakeUser } from '../../__mocks__/auth0User'

describe('User Helper', () => {
  const namespace = process.env.AUTH0_RULES_NAMESPACE as any

  describe('Parse User', () => {
    test('should parse but no user metadata for auth0 sub', () => {
      const user: any = fakeUser()
      user[namespace].user_metadata = '' as any
      const result = parseUser(user)
      expect(result).toEqual({
        firstName: user.nickname,
        lastName: '',
        ref: '',
        role: user[namespace].role,
      })
    })
    test('should parse but no user metadata for non auth0 sub', () => {
      const user: any = fakeUser()
      user[namespace].user_metadata = '' as any
      user.sub = 'google|acb'
      const result = parseUser(user)
      expect(result).toEqual({
        firstName: user.given_name,
        lastName: user.family_name,
        ref: '',
        role: user[namespace].role,
      })
    })
    test('should parse with user meta data', () => {
      const user: any = fakeUser()
      user.sub = 'google|acb'
      const result = parseUser(user)
      expect(result).toEqual({
        firstName: user[namespace].user_metadata.firstName,
        lastName: user[namespace].user_metadata.lastName,
        ref: '',
        role: user[namespace].role,
      })
    })
  })
  describe('Sync user sid token', () => {
    const mockedAxios = jest.mock('axios')
    const reqSpy = mockedAxios.spyOn(axios, 'request')

    const token = 'abc'
    const SID = 'efg'
    test('should fail', async () => {
      reqSpy.mockRejectedValue(null as any)
      const result = await syncToken(token, SID)
      expect(reqSpy).toBeCalledWith({
        method: 'PATCH',
        url: `${process.env.API_HOST}/v1/m2m/user/sid`,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Cookie: `SID=${SID};`,
        },
      })
      expect(result).toBe(false)
    })
    test('should pass', async () => {
      reqSpy.mockResolvedValue('success' as any)
      const result = await syncToken(token, SID)
      expect(reqSpy).toBeCalledWith({
        method: 'PATCH',
        url: `${process.env.API_HOST}/v1/m2m/user/sid`,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Cookie: `SID=${SID};`,
        },
      })
      expect(result).toBe(true)
    })
  })
  describe('Update user ref', () => {
    const mockedAxios = jest.mock('axios')
    const reqSpy = mockedAxios.spyOn(axios, 'request')
    const SID = 'efg'
    const token = 'abc'
    const refresh = jest.fn().mockResolvedValue({ access_token: 'abc' })
    test('should fail', async () => {
      reqSpy.mockRejectedValue({ response: null } as any)
      const result = await updateUserRef(token, refresh, SID)
      expect(reqSpy).toBeCalledWith({
        method: 'POST',
        url: `${process.env.API_HOST}/v1/m2m/user`,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      expect(result).toBe(null)
    })
    test('should pass', async () => {
      const SID = 'efg'
      reqSpy.mockResolvedValue({ data: 'efg' } as any)
      const result = await updateUserRef(token, refresh, SID)
      expect(reqSpy).toBeCalledWith({
        method: 'POST',
        url: `${process.env.API_HOST}/v1/m2m/user`,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      expect(result).toEqual({ access_token: 'abc', ref: 'efg' })
    })
  })
})
