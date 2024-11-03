import { IEncrypter } from '@/domain/forum/application/cryptography/encrypter'
import { IHashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { IHashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    { provide: IEncrypter, useClass: JwtEncrypter },
    { provide: IHashCompare, useClass: BcryptHasher },
    { provide: IHashGenerator, useClass: BcryptHasher },
  ],
  exports: [IEncrypter, IHashGenerator, IHashCompare],
})
export class CryptographyModule {}
