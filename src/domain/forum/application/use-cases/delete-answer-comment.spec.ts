import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let repository: InMemoryAnswerCommentRepository
let answerRepository: InMemoryAnswersRepository
let sut: DeleteAnswerCommentUseCase
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('Delete Answer Comment', async () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswerCommentRepository(
      new InMemoryStudentsRepository(),
    )
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new DeleteAnswerCommentUseCase(repository)
  })

  it('should be able delete a comment on answer', async () => {
    const answer = makeAnswer()
    await answerRepository.create(answer)
    const answerComment = makeAnswerComment({ answerId: answer.id })
    await repository.create(answerComment)

    const result = await sut.execute({
      authorId: answerComment.authorId.toValue(),
      answerCommentId: answerComment.id.toValue(),
    })
    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(null)
  })

  it('should not be able delete a comment on answer another author', async () => {
    const answer = makeAnswer()
    await answerRepository.create(answer)
    const answerComment = makeAnswerComment({ answerId: answer.id })
    await repository.create(answerComment)

    const result = await sut.execute({
      authorId: 'another-author-id',
      answerCommentId: answerComment.id.toValue(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
