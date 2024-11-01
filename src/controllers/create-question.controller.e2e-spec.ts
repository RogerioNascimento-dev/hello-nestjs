import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Create Questions (E2E)', () => {
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

  test('[POST] /questions', async () => {
    const email = 'rogerio.test@gmail.com'
    const password = 'password'
    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: { name: 'Rogério', email, password: hashedPassword },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const question = {
      title: 'This is a question?',
      content: 'I am trying to create a question, but I am not able to do it.',
    }

    const response = await request(app.getHttpServer())
      .post('/questions')
      .send(question)
      .set('Authorization', `Bearer ${accessToken}`)

    const questionCreated = await prisma.question.findFirst({
      where: { title: question.title },
    })
    expect(response.statusCode).toBe(201)
    expect(questionCreated).toBeTruthy()
  })
})
