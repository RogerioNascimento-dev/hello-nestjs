import { INotificationsRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements INotificationsRepository
{
  public items: Notification[] = []
  async create(notificatiion: Notification) {
    this.items.push(notificatiion)
  }

  async findById(notificationId: string) {
    const notification = this.items.find(
      (item) => item.id.toString() === notificationId,
    )
    if (!notification) return null
    return notification
  }

  async save(notification: Notification) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === notification.id.toString(),
    )
    this.items[index] = notification
  }
}