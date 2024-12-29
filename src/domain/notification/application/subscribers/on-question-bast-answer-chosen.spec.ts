import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnQuestionBastAnswerChosen } from './on-question-bast-answer-chosen'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let questionRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>
let attachmentsRepository: InMemoryAttachmentsRepository
let studentRepository: InMemoryStudentsRepository
describe('On question best answer chosen', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentRepository = new InMemoryStudentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentRepository,
    )
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    new OnQuestionBastAnswerChosen(answersRepository, sendNotificationUseCase)
  })
  it('shuld be able send a notification when an best answer chosen.', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionRepository.create(question)
    await answersRepository.create(answer)

    question.bastAnswerId = answer.id
    await questionRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
