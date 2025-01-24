import { createServer } from 'node:http'
import { app } from './build/server.js'

const server = createServer(app)
const port = Number(process.env.PORT || 3333)
const host = process.env.HOST || '0.0.0.0'

server.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`)
})
