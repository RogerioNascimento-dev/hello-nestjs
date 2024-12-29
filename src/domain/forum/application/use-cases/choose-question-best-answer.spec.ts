import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let answerRepository: InMemoryAnswersRepository
let questionRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: ChooseQuestionBestAnswerUseCase
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let studentRepository: InMemoryStudentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository

describe('Choose question best answer', async () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    studentRepository = new InMemoryStudentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      questionRepository,
      answerRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })

    await questionRepository.create(newQuestion)
    await answerRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.question.bastAnswerId?.toValue()).toEqual(
        newAnswer.id.toString(),
      )
    }
  })

  it('should not be able to choose question best answer from with non-existent answer id', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })

    await questionRepository.create(newQuestion)
    await answerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-not-found',
      authorId: newAnswer.authorId.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to choose question best answer from with different author id', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })

    await questionRepository.create(newQuestion)
    await answerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'another-user-id',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
