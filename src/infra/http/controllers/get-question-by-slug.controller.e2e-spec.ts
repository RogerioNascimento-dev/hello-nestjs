import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAattachmentFactory: QuestionAttachmentFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAattachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const createdQuestion = await questionFactory.makePrismaQuestion({
      title: 'How to test an API?',
      slug: Slug.create('how-to-test-an-api'),
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'some attachment here',
    })

    await questionAattachmentFactory.makePrismaQuestionAttachment({
      questionId: createdQuestion.id,
      attachmentId: attachment.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/how-to-test-an-api`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        question: expect.objectContaining({
          title: 'How to test an API?',
          authorName: 'John Doe',
          attachments: expect.arrayContaining([
            expect.objectContaining({ title: 'some attachment here' }),
          ]),
        }),
      }),
    )
  })
})
