import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Auth (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /auth', async () => {
    const email = 'rogerio.test@gmail.com'
    const password = 'password'
    const hashedPassword = await hash(password, 8)

    await prisma.user.create({
      data: { name: 'Rogério', email, password: hashedPassword },
    })
    const response = await request(app.getHttpServer()).post('/auth').send({
      email,
      password,
    })
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    )
  })
})
