// bin/verify-ssl.ts
import pkg from 'pg'
const { Client } = pkg

import env from '#start/env'

async function verifyDatabaseConnection() {
  try {
    console.log('🔍 Informations de connexion :')
    console.log('Host:', env.get('DB_HOST'))
    console.log('Port:', env.get('DB_PORT'))
    console.log('Database:', env.get('DB_DATABASE'))
    console.log('User:', env.get('DB_USER'))

    const connectionString = `postgres://${env.get('DB_USER')}:${env.get('DB_PASSWORD')}@${env.get('DB_HOST')}:${env.get('DB_PORT')}/${env.get('DB_DATABASE')}`

    // Utiliser une méthode de remplacement sécurisée
    const safeConnectionString = connectionString.replace(
      env.get('DB_PASSWORD') || '',
      '****'
    )
    console.log('🔐 Chaîne de connexion:', safeConnectionString)

    const client = new Client({
      host: env.get('DB_HOST'),
      port: env.get('DB_PORT'),
      user: env.get('DB_USER'),
      password: env.get('DB_PASSWORD'),
      database: env.get('DB_DATABASE')
    })

    console.log('🔐 Tentative de connexion à la base de données...')

    await client.connect()
    console.log('✅ Connexion à la base de données réussie!')

    // Exécuter une requête de test
    const result = await client.query('SELECT NOW()')
    console.log('Heure du serveur de base de données:', result.rows[0].now)

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Échec de la connexion à la base de données:', error)
    process.exit(1)
  }
}

verifyDatabaseConnection()