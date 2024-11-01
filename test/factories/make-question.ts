import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'

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
