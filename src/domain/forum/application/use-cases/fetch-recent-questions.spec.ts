import { makeManyQuestions, makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let repository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let studentRepository: InMemoryStudentsRepository
describe('Fetch Recent Questions', async () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentRepository = new InMemoryStudentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentRepository,
    )
    sut = new FetchRecentQuestionsUseCase(repository)
  })

  it('should be able to fetch recent questions', async () => {
    const allPromises: Promise<void>[] = []
    allPromises.push(
      repository.create(makeQuestion({ createdAt: new Date(2024, 9, 10) })),
    )
    allPromises.push(
      repository.create(makeQuestion({ createdAt: new Date(2024, 9, 9) })),
    )
    allPromises.push(
      repository.create(makeQuestion({ createdAt: new Date(2024, 9, 11) })),
    )

    await Promise.all(allPromises)
    const result = await sut.execute({ page: 1 })
    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 9, 9) }),
      expect.objectContaining({ createdAt: new Date(2024, 9, 10) }),
      expect.objectContaining({ createdAt: new Date(2024, 9, 11) }),
    ])
  })
  it('should be able to fetch paginate recent questions', async () => {
    const newQuestions = makeManyQuestions(15)

    const allPromises = newQuestions.map((question) =>
      repository.create(question),
    )
    await Promise.all(allPromises)
    const result = await sut.execute({ page: 2 })
    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toBeTruthy()
    expect(result.value?.questions).toHaveLength(5)
  })
})
