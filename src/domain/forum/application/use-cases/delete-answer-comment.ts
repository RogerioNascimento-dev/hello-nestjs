import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { IAnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentRequest {
  authorId: string
  answerCommentId: string
}
type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: IAnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }
    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }
    await this.answerCommentRepository.delete(answerComment)
    return right(null)
  }
}
