import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { IQuestionsRepository } from '../repositories/questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let repository: IQuestionsRepository
let sut: GetQuestionBySlugUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

describe('Get question by slug', async () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    sut = new GetQuestionBySlugUseCase(repository)
  })

  it('should be able get a question by slug', async () => {
    const newQuestion = makeQuestion()
    await repository.create(newQuestion)

    const result = await sut.execute({
      slug: newQuestion.slug.value,
    })
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.question.content).toEqual(newQuestion.content)
      expect(result.value?.question.slug.value).toEqual(newQuestion.slug.value)
      expect(result.value?.question.id).toBeTruthy()
    }
  })
})
