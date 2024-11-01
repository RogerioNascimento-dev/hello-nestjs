import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let repository: InMemoryAnswersRepository
let questionRepository: InMemoryQuestionsRepository
let sut: FetchQuestionAnswersUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('Fetch Question Answers', async () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(repository)
  })
  it('should be able to fetch answers by questionId', async () => {
    const question = makeQuestion()
    questionRepository.create(question)
    for (let i = 0; i < 5; i++) {
      repository.create(makeAnswer({ questionId: question.id }))
    }
    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(5)
  })
  it('should be able to fetch paginated answers by questionId', async () => {
    const question = makeQuestion()
    questionRepository.create(question)
    for (let i = 0; i < 12; i++) {
      repository.create(makeAnswer({ questionId: question.id }))
    }
    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
