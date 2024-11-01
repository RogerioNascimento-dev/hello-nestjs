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
      instructorId: '1',
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
})
