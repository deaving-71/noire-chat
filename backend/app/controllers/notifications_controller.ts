import type { HttpContext } from '@adonisjs/core/http'
import { updateNotificationValidator } from '#validators/notification'
import Notification from '#models/notification'

export default class NotificationsController {
  async show({ auth, response }: HttpContext) {
    const user = auth.user!

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
    const userId = auth.user!.id

    const { private_chat_id } = await request.validateUsing(updateNotificationValidator)

    const notifications = await Notification.findBy('userId', userId)
    if (!notifications) {
      return response.internalServerError({
        message: 'Something went wrong please try again later',
      })
    }

    if (!notifications.privateChats.includes(private_chat_id)) {
      const { privateChats, friendRequestsCount } = notifications
      return { privateChats, friendRequestsCount }
    }

    notifications.privateChats = notifications.privateChats.filter(
      (id: number) => id !== private_chat_id
    )

    const newNotifications = await notifications.save()

    const { privateChats, friendRequestsCount } = newNotifications

    return { privateChats, friendRequestsCount }
  }
}
