import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let repository: InMemoryQuestionCommentRepository
let questionRepository: InMemoryQuestionsRepository
let sut: CommentOnQuestionUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

describe('Create Comment On Question', async () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionCommentRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
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
