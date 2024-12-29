import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'
import { IQuestionsRepository } from '../repositories/questions-repository'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}
type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails
  }
>
@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: IQuestionsRepository) {}
  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findBySlugWithDetails(slug)
    if (!question) {
      return left(new ResourceNotFoundError())
    }
    return right({ question })
  }
}
