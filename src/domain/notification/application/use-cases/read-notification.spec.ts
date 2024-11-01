import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'

let repository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase
describe('Read Notification', async () => {
  beforeEach(() => {
    repository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(repository)
  })

  it('should be able read notification', async () => {
    const notification = makeNotification()
    await repository.create(notification)
    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(repository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('should not be able read notification from another user', async () => {
    const notification = makeNotification()
    await repository.create(notification)
    const result = await sut.execute({
      recipientId: 'another-user-id',
      notificationId: notification.id.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(repository.items[0].readAt).toBeUndefined()
  })
})
