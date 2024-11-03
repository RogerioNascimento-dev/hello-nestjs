import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'

let studentsRepository: InMemoryStudentsRepository
let sut: RegisterStudentUseCase
let fakeHasher: FakeHasher
describe('Student Register', async () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(studentsRepository, fakeHasher)
  })

  it('should be able register student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johnDoe@email.com',
      password: '1276651',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: studentsRepository.items[0],
    })
  })
  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johnDoe@email.com',
      password: '1276651',
    })
    const passwordHashed = await fakeHasher.hash('1276651')
    expect(result.isRight()).toBe(true)
    expect(studentsRepository.items[0].password).toBe(passwordHashed)
  })
})
