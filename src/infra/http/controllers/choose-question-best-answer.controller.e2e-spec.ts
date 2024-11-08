import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Choose question best answer (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[PATCH] /answers/:answerId/choose-as-bast', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
      content: 'this is a new answer 1',
    })
    const bastAnswer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
      content: 'this is a bast answer',
    })

    const response = await request(app.getHttpServer())
      .patch(`/answers/${bastAnswer.id.toString()}/choose-as-bast`)
      .send()
      .set('Authorization', `Bearer ${accessToken}`)

    const questionOnDatabase = await prisma.question.findFirst({
      where: { id: question.id.toString() },
    })

    expect(response.statusCode).toBe(204)
    expect(questionOnDatabase?.bastAnswerId).toEqual(bastAnswer.id.toString())
  })
})
