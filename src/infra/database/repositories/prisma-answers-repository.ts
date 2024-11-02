import { PaginateParams } from '@/core/repositories/paginate-params'
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
@Injectable()
export class PrismaAnswersRepository implements IAnswersRepository {
  async create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(answerId: string): Promise<Answer | null> {
    throw new Error('Method not implemented.')
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginateParams,
  ): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
}
