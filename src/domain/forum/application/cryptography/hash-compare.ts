export abstract class IHashCompare {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
