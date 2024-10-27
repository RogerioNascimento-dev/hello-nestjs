import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  CreateQuestionRequestValidator,
  createQuestionRequestValidator,
} from './validators/create-question-request.validator'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @UsePipes(new ZodValidationPipe(createQuestionRequestValidator))
  async handler(@Body() body: CreateQuestionRequestValidator) {
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