import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

let repository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe('Delete answer by id', async () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new DeleteAnswerUseCase(repository)
  })

  it('should be able to delete a answer by answerId', async () => {
    const newAnswer = makeAnswer()
    await repository.create(newAnswer)

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({ answerId: newAnswer.id }),
    )
    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({ answerId: newAnswer.id }),
    )
    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
    })
    const answer = await repository.findById(newAnswer.id.toString())
    expect(answer).toBeFalsy()
    expect(repository.items).toHaveLength(0)
    expect(answerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer()
    await repository.create(newAnswer)
    const result = await sut.execute({
      answerId: 'answer-not-found',
      authorId: newAnswer.authorId.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a answer from id inexists', async () => {
    const newAnswer = makeAnswer()
    await repository.create(newAnswer)
    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'another-user-id',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
