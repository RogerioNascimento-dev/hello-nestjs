import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let repository: InMemoryQuestionCommentRepository
let questionRepository: InMemoryQuestionsRepository
let sut: CommentOnQuestionUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let studentRepository: InMemoryStudentsRepository

describe('Create Comment On Question', async () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentRepository = new InMemoryStudentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionCommentRepository(studentRepository)
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentRepository,
    )
    sut = new CommentOnQuestionUseCase(questionRepository, repository)
  })

  it('should be able create a comment on question', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)
    const result = await sut.execute({
      authorId: question.authorId.toValue(),
      questionId: question.id.toValue(),
      content: 'do you need help?',
    })
    expect(result.isRight()).toBe(true)
  })
})
