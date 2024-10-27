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
  CreateAccountRequest,
  createAccountRequest,
} from './validators/create-account-request'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @UsePipes(new ZodValidationPipe(createAccountRequest))
  async handler(@Body() body: CreateAccountRequest) {
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
