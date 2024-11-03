import { Student } from '../../enterprise/entities/student'

export abstract class IStudentsRepository {
  abstract create(student: Student): Promise<void>
  abstract findByEmail(email: string): Promise<Student | null>
}
