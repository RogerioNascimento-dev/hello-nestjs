import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'

import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import {
  createCommentOnQuestionRequestValidator,
  CreateCommentOnQuestionRequestValidator,
} from './validators/create-comment-on-question-request.validator'

@Controller('/questions/:questionId/comments')
export class CreateCommentQuestionController {
  constructor(private commentQuestionUseCase: CommentOnQuestionUseCase) {}
  @Post()
  async handler(
    @Body(new ZodValidationPipe(createCommentOnQuestionRequestValidator))
    body: CreateCommentOnQuestionRequestValidator,
    @CurrentUser() user: AuthUser,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body
    const authorId = user.sub

    console.log('CONTROLLER HERE', content, questionId, authorId)

    const result = await this.commentQuestionUseCase.execute({
      content,
      questionId,
      authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
