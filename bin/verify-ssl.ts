// bin/verify-ssl.ts
import fs from 'node:fs'
import path from 'node:path'
import pkg from 'pg'
const { Client } = pkg

import env from '#start/env'

async function verifySSLConnection() {
  try {
    // Chemins des certificats
    const sslCertsDir = path.resolve(process.cwd(), 'ssl_certs')

    console.log('🔍 Informations de connexion :')
    console.log('Host:', env.get('DB_HOST'))
    console.log('Port:', env.get('DB_PORT'))
    console.log('Database:', env.get('DB_DATABASE'))
    console.log('User:', env.get('DB_USER'))
    console.log('SSL Certs Dir:', sslCertsDir)

    // Configuration SSL
    const sslConfig: any = {
      rejectUnauthorized: false  // Temporairement désactivé pour diagnostic
    }

    // Vérifier et charger les certificats
    const certificateFiles = ['ca-cert.pem', 'client-key.pem', 'client-cert.pem']
    const loadedCerts: string[] = []

    for (const certFile of certificateFiles) {
      const fullPath = path.join(sslCertsDir, certFile)

      try {
        if (fs.existsSync(fullPath)) {
          const certContent = fs.readFileSync(fullPath, 'utf8')

          if (certFile.includes('ca-cert')) {
            sslConfig.ca = certContent
            console.log('✅ CA Certificate loaded')
          }
          if (certFile.includes('client-key')) {
            sslConfig.key = certContent
            console.log('✅ Client Key loaded')
          }
          if (certFile.includes('client-cert')) {
            sslConfig.cert = certContent
            console.log('✅ Client Certificate loaded')
          }

          loadedCerts.push(certFile)
        } else {
          console.warn(`❌ Certificate file not found: ${fullPath}`)
        }
      } catch (readError) {
        console.error(`Erreur de lecture du certificat ${certFile}:`, readError)
      }
    }

    // Configuration de connexion
    const connectionString = `postgres://${env.get('DB_USER')}:${env.get('DB_PASSWORD')}@${env.get('DB_HOST')}:${env.get('DB_PORT')}/${env.get('DB_DATABASE')}`
    console.log('🔐 Connection String:', connectionString.replace(env.get('DB_PASSWORD'), '****'))

    const client = new Client({
      connectionString,
      ssl: loadedCerts.length > 0 ? sslConfig : {
        rejectUnauthorized: false  // Fallback si pas de certificats
      }
    })

    // Tentative de connexion
    console.log('🔐 Tentative de connexion SSL...')
    console.log('Certificats chargés:', loadedCerts)

    await client.connect()
    console.log('✅ Connexion SSL réussie!')

    // Exécuter une requête de test
    const result = await client.query('SELECT NOW()')
    console.log('Heure du serveur de base de données:', result.rows[0].now)

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Échec de la connexion SSL:', error)
    process.exit(1)
  }
}

verifySSLConnection()