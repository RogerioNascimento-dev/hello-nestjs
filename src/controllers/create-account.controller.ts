import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  createAccountRequestValidator,
  CreateAccountRequestValidator,
} from './validators/create-account-request.validator'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @UsePipes(new ZodValidationPipe(createAccountRequestValidator))
  async handler(@Body() body: CreateAccountRequestValidator) {
    const { name, email, password } = body
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    const hashedPassword = await hash(password, 8)

    if (userWithSameEmail) {
      throw new ConflictException('Email already exists')
    }

    await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
  }
}
