import {
  Channel,
  FriendRequests,
  FriendsList,
  IncomingFriendRequest,
  OutgoingFriendRequest,
  User,
} from "@/types"
import { create } from "zustand"

import { createSelectors } from "./create_selectors"

type InitialState = {
  user: User | null
  auth: {}
  friends: FriendsList
  friend_requests: FriendRequests
  channels: Channel[]
}

type Actions = {
  setUser: (user: User) => void
  setAuthenticated: (state: boolean) => void

  setFriends(friends: FriendsList): void
  setFriendRequests(friend_requests: FriendRequests): void
  appendFriend(newFriend: User): void
  appendIncomingRequest(request: IncomingFriendRequest): void
  appendOutgoingRequest(request: OutgoingFriendRequest): void
  removeRequest(requestId: number): void
  resetFriendsListAndRequests(): void

  setChannels(channels: Channel[]): void
}

type UseStore = InitialState & Actions

const initialState: InitialState = {
  user: null,
  auth: {},
  friends: {
    online: [],
    offline: [],
  },
  friend_requests: {
    outgoing: [],
    incoming: [],
  },
  channels: [],
}

export const useStoreBase = create<UseStore>((set) => ({
  ...initialState,

  setUser(user) {
    set({ user })
  },

  setAuthenticated(state) {
    set({ auth: state })
  },

  setFriends(friends: FriendsList) {
    set({ friends })
  },

  setFriendRequests(friend_requests) {
    set({ friend_requests })
  },

  setChannels(channels) {
    set({ channels })
  },

  appendFriend(newFriend) {
    set((state) => {
      const friends = { ...state.friends }

      const isOnline = newFriend.isOnline
      isOnline
        ? friends.online.push(newFriend)
        : friends.offline.push(newFriend)

      return { friends: friends }
    })
  },

  appendIncomingRequest(request) {
    set((state) => {
      const friend_requests = state.friend_requests
      return {
        friend_requests: {
          outgoing: [...friend_requests.outgoing],
          incoming: [...friend_requests.incoming, request],
        },
      }
    })
  },

  appendOutgoingRequest(request) {
    set((state) => {
      const friend_requests = state.friend_requests
      return {
        friend_requests: {
          outgoing: [...friend_requests.outgoing, request],
          incoming: [...friend_requests.incoming],
        },
      }
    })
  },

  removeRequest(id) {
    set((state) => {
      const friend_requests = state.friend_requests
      return {
        friend_requests: {
          outgoing: friend_requests.outgoing.filter(
            (request) => request.id !== id
          ),
          incoming: friend_requests.incoming.filter(
            (request) => request.id !== id
          ),
        },
      }
    })
  },

  resetFriendsListAndRequests() {
    set({
      friends: {
        online: [],
        offline: [],
      },
      friend_requests: {
        outgoing: [],
        incoming: [],
      },
    })
  },
}))

export const useStore = createSelectors(useStoreBase)
