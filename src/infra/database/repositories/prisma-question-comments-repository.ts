import { PaginateParams } from '@/core/repositories/paginate-params'
import { IQuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements IQuestionCommentRepository
{
  async create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.')
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginateParams,
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }
}
