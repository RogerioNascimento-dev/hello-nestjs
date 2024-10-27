import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CreateAccountController } from './controllers/create-account.controller'
import { envValidator } from './env'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envValidator.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
