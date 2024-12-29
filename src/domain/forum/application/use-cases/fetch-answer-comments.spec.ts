import { makeAnswer } from 'test/factories/make-answer'

import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let repository: InMemoryAnswerCommentRepository
let answerRepository: InMemoryAnswersRepository
let sut: FetchAnswerCommentsUseCase
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

describe('Fetch Answer Comments', async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    repository = new InMemoryAnswerCommentRepository(inMemoryStudentsRepository)
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(repository)
  })
  it('should be able to fetch answer comments by answerId', async () => {
    const answer = makeAnswer()
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.create(student)
    answerRepository.create(answer)

    repository.create(
      makeAnswerComment({ answerId: answer.id, authorId: student.id }),
    )
    repository.create(
      makeAnswerComment({ answerId: answer.id, authorId: student.id }),
    )
    repository.create(
      makeAnswerComment({ answerId: answer.id, authorId: student.id }),
    )
    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
    })
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated answer comments by answerId', async () => {
    const answer = makeAnswer()
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.create(student)
    answerRepository.create(answer)
    for (let i = 0; i < 12; i++) {
      repository.create(
        makeAnswerComment({ answerId: answer.id, authorId: student.id }),
      )
    }
    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
