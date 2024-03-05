import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'
import { createLogger } from '../utils/logger'

const logger = createLogger('AuthUtils')

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export function getToken(authHeader: string): string {

  if (!authHeader) {
    logger.info('No authentication header')
    throw new Error('No authentication header')
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    logger.info('Invalid authentication header')
    throw new Error('Invalid authentication header')
  }

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}