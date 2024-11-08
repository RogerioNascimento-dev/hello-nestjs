import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { PrismaQuestionMapper } from '@/infra/database/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
): Question {
  return Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id,
  )
}
export function makeManyQuestions(
  quantity: number,
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
): Question[] {
  const questions: Question[] = []
  for (let i = 0; i < quantity; i++) {
    questions.push(
      Question.create(
        {
          authorId: new UniqueEntityID(),
          title: faker.lorem.sentence(4),
          content: faker.lorem.paragraph(),
          ...override,
        },
        id,
      ),
    )
  }
  return questions
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}
