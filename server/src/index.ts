import { startServer } from './server.js'

if (process.env.NODE_ENV !== 'test') void startServer()
