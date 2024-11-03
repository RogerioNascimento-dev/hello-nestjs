import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import {
  createAccountRequestValidator,
  CreateAccountRequestValidator,
} from './validators/create-account-request.validator'

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}
  @Post()
  @UsePipes(new ZodValidationPipe(createAccountRequestValidator))
  async handler(@Body() body: CreateAccountRequestValidator) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({ name, email, password })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
