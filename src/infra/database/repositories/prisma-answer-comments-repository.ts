import { PaginateParams } from '@/core/repositories/paginate-params'
import { IAnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements IAnswerCommentRepository
{
  async create(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.')
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginateParams,
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.')
  }
}
