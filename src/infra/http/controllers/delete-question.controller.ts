import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestionUseCase: DeleteQuestionUseCase) {}
  @Delete()
  @HttpCode(204)
  async handler(
    @CurrentUser() user: AuthUser,
    @Param('id') questionId: string,
  ) {
    const userId = user.sub
    const result = await this.deleteQuestionUseCase.execute({
      authorId: userId,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
