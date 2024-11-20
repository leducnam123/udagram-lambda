import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-qeyrun36bsqbp1t8.us.auth0.com/.well-known/jwks.json'

const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJCVPbW3cyPZWIMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1xZXlydW4zNmJzcWJwMXQ4LnVzLmF1dGgwLmNvbTAeFw0yNDExMTkx
NTQyMTNaFw0zODA3MjkxNTQyMTNaMCwxKjAoBgNVBAMTIWRldi1xZXlydW4zNmJz
cWJwMXQ4LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAOy1r52bNjFA9kUFOvN5TIoMBWp+OzuMpDe0eP5g8qGAxJJ1KhHTZ+r0mn5X
CG8mzAN31Hr33WwLz76iNlhA1jL/sLK3xinQOHMJxv3L2qCpmpd/gjBExrzJTSZc
amOYS3mInztr3WbvtLfmXPrQjfBJNahirpvOCEwXrBvxiDcLTTjWufcxHHZBEvzW
WumLLoXV3GDkHoS9i9akchnDLPptD/GHOmMPQl8g+o6GNmcDyDsOP1YqnmacsT9N
nDR74ecd59F2hmtxU/siqqPIUrKNMf7CI4eTfLCzevDIO6dOHMkWxzlYQ5xwRStX
5T2QQyuRh3UPXDCwtajfRV+D9Q0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUA6ecwYIxxIpszVvTG0YeZkRUMxowDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQChNj6ar9OoF0nMYK0ZZq6QC/pWxV5jHX3oWjbrpVkz
QfA67m0ijl+d9kpVIneDkj3RjHKQRhXtI3VXFkUQAzP2lSqD7PQ9yIIuXoUtGyNB
augZQQzxMu1IoFOneza30RN/TxS7zZPddOLec+s99ooWcnZZHKoHKB2gf81xrUf3
O5X8vZYRpzw60+cQdFR06/9FvBirhcdjmKffO2sS1NCq9URR93jylr6N6coKAy+m
JlXgdY+xPovN8TIQx8x815Yk1wtGyKSRVIfEBLZsTg99fVth6iLLyu9GLhZRCQ/k
4wsNQy3ApSedUfJ6WRGxi3pnPLLI4zXa3xWNJtSoRN9w
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  if (!authHeader) throw new Error('No authorization header')

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authorization header')
  }

  const token = getToken(authHeader)
  return jsonwebtoken.verify(token, cert, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
