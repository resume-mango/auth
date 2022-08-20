import dotenv from 'dotenv'
// import wellKnown from './__mocks__/well-known.json'
// import * as certs from './__mocks__/cert'
// import nock from 'nock'
dotenv.config({ path: '.env.staging' })

jest.setTimeout(30000)

// beforeEach(function () {
//   nock('https://op.example.com')
//     .persist()
//     .get('/.well-known/openid-configuration')
//     .reply(200, wellKnown)

//   nock('https://op.example.com')
//     .persist()
//     .get('/.well-known/jwks.json')
//     .reply(200, certs.jwks)

//   nock('https://test.eu.auth0.com')
//     .persist()
//     .get('/.well-known/openid-configuration')
//     .reply(200, { ...wellKnown, end_session_endpoint: undefined })

//   nock('https://test.eu.auth0.com')
//     .persist()
//     .get('/.well-known/jwks.json')
//     .reply(200, certs.jwks)
// })

// afterEach(function () {
//   nock.cleanAll()
// })
