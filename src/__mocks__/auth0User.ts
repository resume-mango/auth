import { faker } from '@faker-js/faker'
const namespace = process.env.AUTH0_RULES_NAMESPACE as string

export const fakeUser = () => {
  return {
    given_name: faker.name.firstName(),
    family_name: faker.name.lastName(),

    sub: 'auth0|abc',
    nickname: 'nick',
    [namespace]: {
      user_metadata: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
      app_metadata: {},
      role: ['standard'],
    },
  }
}
