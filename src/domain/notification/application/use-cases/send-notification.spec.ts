import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let repository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase
describe('Send Notification', async () => {
  beforeEach(() => {
    repository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(repository)
  })

  it('should be able send notification', async () => {
    const title = 'your question was answered.'
    const content = 'your question was answerd by a user.'
    const result = await sut.execute({
      recipientId: '1',
      title,
      content,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      notification: expect.objectContaining({
        title,
        content,
      }),
    })
  })
})
