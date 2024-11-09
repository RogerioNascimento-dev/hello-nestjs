import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let repository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
describe('Create Question', async () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    sut = new CreateQuestionUseCase(repository)
  })

  it('should be able create a question', async () => {
    const content = 'I need help to create a new question.'
    const result = await sut.execute({
      authorId: '2',
      title: 'How to create a question?',
      content,
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.question.content).toEqual(content)
    expect(result.value?.question.slug.value).toEqual(
      'how-to-create-a-question',
    )
    expect(repository.items[0].attachments.currentItems).toHaveLength(2)
    expect(repository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should persist attachments when creating a new question', async () => {
    const content = 'I need help to create a new question.'
    const result = await sut.execute({
      authorId: '2',
      title: 'How to create a question?',
      content,
      attachmentsIds: ['1', '5'],
    })
    expect(result.isRight()).toBe(true)
    expect(questionAttachmentsRepository.items).toHaveLength(2)
    expect(questionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('5') }),
      ]),
    )
  })
})
