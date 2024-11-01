import { makeAnswer } from 'test/factories/make-answer'

import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let repository: InMemoryAnswerCommentRepository
let answerRepository: InMemoryAnswersRepository
let sut: FetchAnswerCommentsUseCase
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('Fetch Answer Comments', async () => {
  beforeEach(() => {
    repository = new InMemoryAnswerCommentRepository()
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(repository)
  })
  it('should be able to fetch answer comments by answerId', async () => {
    const answer = makeAnswer()
    answerRepository.create(answer)
    repository.create(makeAnswerComment({ answerId: answer.id }))
    repository.create(makeAnswerComment({ answerId: answer.id }))
    repository.create(makeAnswerComment({ answerId: answer.id }))
    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
    })
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated answer comments by answerId', async () => {
    const answer = makeAnswer()
    answerRepository.create(answer)
    for (let i = 0; i < 12; i++) {
      repository.create(makeAnswerComment({ answerId: answer.id }))
    }
    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
