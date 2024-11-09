import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })
const prisma = new PrismaClient()
const schemaId = `test-${randomUUID()}`
function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Pleas provide DATABASE_URL environment variable.')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', `${schemaId}`)
  return url.toString()
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseURL
  execSync(`npx prisma migrate deploy`)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
