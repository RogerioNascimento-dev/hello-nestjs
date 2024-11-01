import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let repository: InMemoryAnswerCommentRepository
let answerRepository: InMemoryAnswersRepository
let sut: CommentOnAnswerUseCase
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('Create Comment On Answer', async () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswerCommentRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new CommentOnAnswerUseCase(answerRepository, repository)
  })

  it('should be able create a comment on answer', async () => {
    const answer = makeAnswer()
    await answerRepository.create(answer)
    const result = await sut.execute({
      authorId: answer.authorId.toValue(),
      answerId: answer.id.toValue(),
      content: 'do you need help?',
    })

    expect(result.isRight()).toBe(true)
  })
})
