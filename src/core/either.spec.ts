import { Either, left, right } from './either'

describe('Either Tests', async () => {
  function doSomething(shoudSuccess: boolean): Either<string, number> {
    if (shoudSuccess) {
      return right(10)
    } else {
      return left('error')
    }
  }

  it('success result', async () => {
    const result = doSomething(true)
    expect(result.isLeft()).toEqual(false)
    expect(result.isRight()).toEqual(true)
  })

  it('error result', async () => {
    const result = doSomething(false)
    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
  })
})
