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

import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import {
  createCommentOnAnswerRequestValidator,
  CreateCommentOnAnswerRequestValidator,
} from './validators/create-comment-on-answer-request.validator'

@Controller('/answers/:answerId/comments')
export class CreateCommentAnswerController {
  constructor(private commentAnswerUseCase: CommentOnAnswerUseCase) {}
  @Post()
  async handler(
    @Body(new ZodValidationPipe(createCommentOnAnswerRequestValidator))
    body: CreateCommentOnAnswerRequestValidator,
    @CurrentUser() user: AuthUser,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body
    const authorId = user.sub

    const result = await this.commentAnswerUseCase.execute({
      content,
      answerId,
      authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
