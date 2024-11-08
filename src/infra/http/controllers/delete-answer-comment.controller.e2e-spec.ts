import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete Answer Comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answercommentFactory: AnswerCommentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerCommentFactory,
        AnswerFactory,
        QuestionFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    answercommentFactory = moduleRef.get(AnswerCommentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    await app.init()
  })

  test('[DELETE] /answers/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })
    const answerComment = await answercommentFactory.makePrismaAnswerComment({
      authorId: user.id,
      answerId: answer.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerComment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    const answercommentDeleted = await prisma.comment.findUnique({
      where: { id: answerComment.id.toValue() },
    })

    expect(response.statusCode).toBe(204)
    expect(answercommentDeleted).toBeNull()
  })
})
