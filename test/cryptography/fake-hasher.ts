import { IHashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { IHashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class FakeHasher implements IHashGenerator, IHashCompare {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }
}
