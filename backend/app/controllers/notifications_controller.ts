import type { HttpContext } from '@adonisjs/core/http'
import { updateNotificationValidator } from '#validators/notification'
import Notification from '#models/notification'

export default class NotificationsController {
  async show({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'You must be logged in to perform this action' })
    }

    const notification = await user.related('notifications').query().first()

    if (!notification) {
      return response.internalServerError({
        message: 'Something went wrong please try again later',
      })
    }

    const { friendRequestsCount, privateChats } = notification

    return { friendRequestsCount, privateChats }
  }

  async update({ auth, request, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return response.unauthorized({ message: 'You must be logged in to perform this action' })
    }

    const { private_chat_id } = await request.validateUsing(updateNotificationValidator)

    const notifications = await Notification.findBy('userId', userId)
    if (!notifications) {
      return response.internalServerError({
        message: 'Something went wrong please try again later',
      })
    }

    const notificationsJSON = notifications.serialize()

    if (!notificationsJSON.privateChats.includes(private_chat_id)) return

    notifications.privateChats = notificationsJSON.privateChats.filter(
      (id: number) => id !== private_chat_id
    )

    await notifications.save()

    const { privateChats, friendRequestsCount } = notifications

    return { privateChats: JSON.parse(privateChats), friendRequestsCount }
  }
}
