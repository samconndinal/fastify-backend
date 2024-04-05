import dotenv from 'dotenv'
dotenv.config({ path: '.env' }) // replace '.env2' with your file path

/**
 * help in reading environment variables
 * if the requested env variable is not set then error is thrown
 */
export function env (key: string): string {
  const value = process.env[key]
  if (value == null) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}
