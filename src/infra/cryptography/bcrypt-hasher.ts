import { IHashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { IHashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements IHashGenerator, IHashCompare {
  private HASH_SALT_LENGTH = 8
  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
