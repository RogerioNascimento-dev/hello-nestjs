import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'

let repository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit question by id', async () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    sut = new EditQuestionUseCase(repository, questionAttachmentsRepository)
  })

  it('should be able to edit a question by questionId', async () => {
    const newQuestion = makeQuestion()
    await repository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
    )
    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: 'new title edited',
      content: 'new content edited',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(repository.items).toHaveLength(1)
    if (result.isRight()) {
      expect(result.value.question).toMatchObject({
        title: 'new title edited',
        content: 'new content edited',
      })
    }
    expect(repository.items[0].attachments.currentItems).toHaveLength(2)
    expect(repository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion()
    await repository.create(newQuestion)
    const result = await sut.execute({
      questionId: 'question-not-found',
      authorId: newQuestion.authorId.toString(),
      title: 'new title edited',
      content: 'new content edited',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a question from id inexists', async () => {
    const newQuestion = makeQuestion()
    await repository.create(newQuestion)
    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'another-user-id',
      title: 'new title edited',
      content: 'new content edited',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
