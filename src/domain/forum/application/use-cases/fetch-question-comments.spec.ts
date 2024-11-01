import { makeQuestion } from 'test/factories/make-question'

import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let repository: InMemoryQuestionCommentRepository
let questionRepository: InMemoryQuestionsRepository
let sut: FetchQuestionCommentsUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

describe('Fetch Question Comments', async () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionCommentRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(repository)
  })
  it('should be able to fetch question comments by questionId', async () => {
    const question = makeQuestion()
    questionRepository.create(question)
    repository.create(makeQuestionComment({ questionId: question.id }))
    repository.create(makeQuestionComment({ questionId: question.id }))
    repository.create(makeQuestionComment({ questionId: question.id }))
    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments by questionId', async () => {
    const question = makeQuestion()
    questionRepository.create(question)
    for (let i = 0; i < 12; i++) {
      repository.create(makeQuestionComment({ questionId: question.id }))
    }
    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
