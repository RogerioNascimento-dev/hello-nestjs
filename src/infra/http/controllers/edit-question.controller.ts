import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import {
  EditQuestionRequestValidator,
  editQuestionRequestValidator,
} from './validators/edit-question-request.validator'

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestionUseCase: EditQuestionUseCase) {}
  @Put()
  @HttpCode(204)
  async handler(
    @Body(new ZodValidationPipe(editQuestionRequestValidator))
    body: EditQuestionRequestValidator,
    @CurrentUser() user: AuthUser,
    @Param('id') questionId: string,
  ) {
    const { title, content, attachments } = body
    const userId = user.sub

    const result = await this.editQuestionUseCase.execute({
      title,
      content,
      authorId: userId,
      questionId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
