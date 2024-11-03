import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import {
  createAccountRequestValidator,
  CreateAccountRequestValidator,
} from './validators/create-account-request.validator'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}
  @Post()
  @UsePipes(new ZodValidationPipe(createAccountRequestValidator))
  async handler(@Body() body: CreateAccountRequestValidator) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({ name, email, password })

    if (result.isLeft()) {
      throw new Error()
    }
  }
}
