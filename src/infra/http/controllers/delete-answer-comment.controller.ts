import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handler(
    @CurrentUser() user: AuthUser,
    @Param('id') answerCommentId: string,
  ) {
    const userId = user.sub
    const result = await this.deleteAnswerCommentUseCase.execute({
      authorId: userId,
      answerCommentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
