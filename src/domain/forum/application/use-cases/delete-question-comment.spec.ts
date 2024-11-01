import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let repository: InMemoryQuestionCommentRepository
let questionRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionCommentUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

describe('Delete Question Comment', async () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionCommentRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new DeleteQuestionCommentUseCase(repository)
  })

  it('should be able delete a comment on question', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)
    const questionComment = makeQuestionComment({ questionId: question.id })
    await repository.create(questionComment)

    await expect(
      sut.execute({
        authorId: questionComment.authorId.toValue(),
        questionCommentId: questionComment.id.toValue(),
      }),
    ).resolves.resolves.toBeTruthy()
    expect(repository.items).toHaveLength(0)
  })

  it('should not be able delete a comment on question another author', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)
    const questionComment = makeQuestionComment({ questionId: question.id })
    await repository.create(questionComment)

    const result = await sut.execute({
      authorId: 'another-author-id',
      questionCommentId: questionComment.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(repository.items).toHaveLength(1)
  })
})
