import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

describe('Auth (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    await app.init()
  })

  test('[POST] /auth', async () => {
    const email = 'rogerio.test@gmail.com'
    const password = 'password'

    await studentFactory.makePrismaStudent({
      email: 'rogerio.test@gmail.com',
      password: await hash(password, 8),
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
