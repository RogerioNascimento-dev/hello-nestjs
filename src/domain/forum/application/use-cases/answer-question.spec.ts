import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let repository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
describe('Answer Question', async () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new AnswerQuestionUseCase(repository)
  })

  it('should be able create answer', async () => {
    const conntentResponse = 'content response'
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: conntentResponse,
      attachmentsIds: ['1', '2'],
    })
    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result?.value?.answer.content).toEqual(conntentResponse)
      expect(repository.items[0].attachments.currentItems).toHaveLength(2)
      expect(repository.items[0].attachments.currentItems).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
      ])
    }
  })

  it('should persist attachments when creating a new answer', async () => {
    const content = 'I need help to create a new answer.'
    const result = await sut.execute({
      authorId: '2',
      questionId: '1',
      content,
      attachmentsIds: ['1', '5'],
    })
    expect(result.isRight()).toBe(true)
    expect(answerAttachmentsRepository.items).toHaveLength(2)
    expect(answerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('5') }),
      ]),
    )
  })
})
