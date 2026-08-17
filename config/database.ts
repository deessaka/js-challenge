import fs from 'node:fs'
import path from 'node:path'
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const getSslConfig = () => {
  const host = env.get('DB_HOST')
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0'

  if (isLocalhost && env.get('NODE_ENV') !== 'production') {
    return false
  }

  const sslConfig: Record<string, string | undefined> = {}

  const caPath = env.get('DB_SSL_CA')
  const keyPath = env.get('DB_SSL_KEY')
  const certPath = env.get('DB_SSL_CERT')

  try {
    if (caPath) {
      const caFile = fs.readFileSync(path.resolve('ssl_certs', caPath))
      sslConfig.ca = caFile.toString()
    }

    if (keyPath) {
      const keyFile = fs.readFileSync(path.resolve('ssl_certs', keyPath))
      sslConfig.key = keyFile.toString()
    }

    if (certPath) {
      const certFile = fs.readFileSync(path.resolve('ssl_certs', certPath))
      sslConfig.cert = certFile.toString()
    }
  } catch (error) {
    console.error('Error reading SSL files:', error)
  }

  return {
    rejectUnauthorized: false,
    ...(Object.keys(sslConfig).length > 0 ? sslConfig : {}),
  }
}

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ssl: getSslConfig(),
      },
      pool: {
        min: 1,
        max: env.get('NODE_ENV') === 'test' ? 1 : 10,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
