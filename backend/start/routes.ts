/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const LoginController = () => import('#controllers/auth/login_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const VerifyAuthController = () => import('#controllers/auth/verify_auth_controller')
const ProfileController = () => import('#controllers/profile_controller')
const FriendsController = () => import('#controllers/friends_controller')
const FriendRequestController = () => import('#controllers/friend_requests_controller')
const PrivateChatsController = () => import('#controllers/private_chats_controller')
const ChannelsController = () => import('#controllers/channels_controller')
const MembershipsController = () => import('#controllers/memberships_controller')
const NotificationsController = () => import('#controllers/notifications_controller')

router
  .group(() => {
    /*
    |--------------------------------------------------------------------------
    | Protected routes
    |--------------------------------------------------------------------------
    */
    router
      .group(() => {
        router.get('protected', () => {
          return 'Protected route hit'
        })
        router.get('/profile', [ProfileController, 'show'])

        router.get('/friends', [FriendsController, 'index'])
        router.post('/friends', [FriendsController, 'store'])

        router.post('/friend-requests', [FriendRequestController, 'store'])
        router.delete('/friend-requests/:userId', [FriendRequestController, 'destroy'])

        router.get('/private-chats', [PrivateChatsController, 'index'])
        router.get('/private-chats/:id', [PrivateChatsController, 'show'])
        router.post('/private-chats', [PrivateChatsController, 'store'])

        router.get('/channels/:slug', [ChannelsController, 'show'])
        router.put('/channels/:id', [ChannelsController, 'update'])
        router.post('/channels', [ChannelsController, 'store'])

        router.put('/channel-member/:slug', [MembershipsController, 'update'])

        router.get('/notifications', [NotificationsController, 'show'])
        router.put('/notifications', [NotificationsController, 'update'])
        router.get('/test', async ({ auth }) => {
          const notifications = await auth.user!.related('notifications').query().first()

          return notifications
        })

        router.post('/test', async ({ auth }) => {
          const notifications = await auth.user!.related('notifications').query().first()
          notifications?.privateChats.push(1, 2)
          const savedNotifications = await notifications?.save()
          return savedNotifications
        })

        router.delete('/auth/logout', [LoginController, 'destroy'])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Unprotected routes
    |--------------------------------------------------------------------------
    */
    router
      .group(() => {
        router.post('/register', [RegisterController, 'store'])
        router.post('/login', [LoginController, 'store'])
        router.get('/', [VerifyAuthController, 'show'])
      })
      .prefix('auth')

    router.get('unprotected', () => {
      return 'Unprotected route hit'
    })
  })
  .prefix('v1')
