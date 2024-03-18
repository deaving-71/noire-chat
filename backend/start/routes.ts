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
const ProfileController = () => import('#controllers/profile_controller')
const FriendsController = () => import('#controllers/friends_controller')
const FriendRequestController = () => import('#controllers/friend_requests_controller')
const PrivateChatsController = () => import('#controllers/private_chats_controller')
const ChannelsController = () => import('#controllers/channels_controller')
const MembershipsController = () => import('#controllers/memberships_controller')

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
        router.post('/channels', [ChannelsController, 'store'])

        router.put('/membership/:slug', [MembershipsController, 'update'])

        router.delete('/logout', [LoginController, 'destroy'])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Unprotected routes
    |--------------------------------------------------------------------------
    */
    router
      .group(() => {
        router.post('register', [RegisterController, 'store'])
        router.post('login', [LoginController, 'store'])
        router.get('/', async ({ auth }) => {
          return await auth.check()
        })
      })
      .prefix('auth')

    router.get('unprotected', () => {
      return 'Unprotected route hit'
    })
  })
  .prefix('v1')
