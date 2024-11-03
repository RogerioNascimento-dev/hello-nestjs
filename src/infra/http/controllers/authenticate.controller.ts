import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import {
  AuthenticateRequestValidator,
  authenticateRequestValidator,
} from './validators/authenticate-request.validator'

@Controller('/auth')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateRequestValidator))
  async handler(@Body() body: AuthenticateRequestValidator) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({ email, password })
    if (result.isLeft()) {
      throw new Error('Invalid credentials')
    }
    const { accessToken } = result.value
    return { access_token: accessToken }
  }
}
