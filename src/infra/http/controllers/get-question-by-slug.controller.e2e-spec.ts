import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const email = 'rogerio.test@gmail.com'
    const password = 'password'
    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: { name: 'Rogério', email, password: hashedPassword },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.create({
      data: {
        title: 'Question 1?',
        content: 'This is a question 1.',
        authorId: user.id,
        slug: 'this-is-a-question-1',
      },
    })
    const response = await request(app.getHttpServer())
      .get('/questions/this-is-a-question-1')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        question: expect.objectContaining({ title: 'Question 1?' }),
      }),
    )
  })
})
