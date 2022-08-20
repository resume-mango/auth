const PORT = process.env.APP_PORT || 4000

const APP_ORIGIN = `http://localhost:${PORT}`

const IN_PROD = process.env.NODE_ENV === 'production'
const IN_STAGING = process.env.NODE_ENV === 'test'

export { PORT, APP_ORIGIN, IN_PROD, IN_STAGING }
