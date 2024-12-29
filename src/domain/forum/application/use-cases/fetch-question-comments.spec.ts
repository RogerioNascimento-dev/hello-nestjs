import { makeQuestion } from 'test/factories/make-question'

import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let repository: InMemoryQuestionCommentRepository
let questionRepository: InMemoryQuestionsRepository
let sut: FetchQuestionCommentsUseCase
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

describe('Fetch Question Comments', async () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    repository = new InMemoryQuestionCommentRepository(
      inMemoryStudentsRepository,
    )
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(repository)
  })
  it('should be able to fetch question comments by questionId', async () => {
    const question = makeQuestion()
    const student = makeStudent({ name: 'John Doe' })

    questionRepository.create(question)
    inMemoryStudentsRepository.create(student)

    const comment1 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })
    await repository.create(comment1)
    await repository.create(comment2)
    await repository.create(comment3)

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated question comments by questionId', async () => {
    const question = makeQuestion()
    const student = makeStudent({ name: 'John Doe' })
    questionRepository.create(question)
    inMemoryStudentsRepository.create(student)

    for (let i = 0; i < 12; i++) {
      repository.create(
        makeQuestionComment({ questionId: question.id, authorId: student.id }),
      )
    }
    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
        }),
      ]),
    )
  })
})
