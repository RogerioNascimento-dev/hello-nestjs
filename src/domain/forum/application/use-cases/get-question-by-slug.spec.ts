import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { IQuestionsRepository } from '../repositories/questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let repository: IQuestionsRepository
let sut: GetQuestionBySlugUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let studentRepository: InMemoryStudentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository

describe('Get question by slug', async () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentRepository,
    )
    sut = new GetQuestionBySlugUseCase(repository)
  })

  it('should be able get a question by slug', async () => {
    const student = makeStudent({ name: 'John Doe' })
    studentRepository.items.push(student)

    const newQuestion = makeQuestion({ authorId: student.id })
    await repository.create(newQuestion)

    const attachment = makeAttachment({ title: 'Attachment 1' })

    attachmentsRepository.items.push(attachment)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    )

    const result = await sut.execute({
      slug: newQuestion.slug.value,
    })
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      const { question } = result.value
      expect(question.content).toEqual(newQuestion.content)
      expect(question.author).toEqual('John Doe')
      expect(question.attachments).toHaveLength(1)
      expect(question.slug.value).toEqual(newQuestion.slug.value)
      expect(question.questionId).toBeTruthy()
    }
  })
})
