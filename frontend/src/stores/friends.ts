import { IncomingFriendRequest, OutgoingFriendRequest, User } from "@/types"
import { create } from "zustand"

type UseFriends = {
  friends: FriendsList
  friend_requests: FriendRequests

  setFriends(friends: FriendsList): void
  setFriendRequests(friend_requests: FriendRequests): void

  appendFriend(newFriend: User): void
  appendIncomingRequest(request: IncomingFriendRequest): void
  appendOutgoingRequest(request: OutgoingFriendRequest): void

  removeRequest(requestId: number): void

  reset(): void
}

type FriendsList = {
  online: User[]
  offline: User[]
}

type FriendRequests = {
  outgoing: OutgoingFriendRequest[]
  incoming: IncomingFriendRequest[]
}

export const useFriends = create<UseFriends>((set, get) => ({
  friends: {
    online: [],
    offline: [],
  },
  friend_requests: {
    outgoing: [],
    incoming: [],
  },

  setFriends(friends: FriendsList) {
    set({ friends })
  },

  setFriendRequests(friend_requests) {
    set({ friend_requests })
  },

  appendFriend(newFriend) {
    const { friends } = get()
    const newFriendsList = { ...friends }

    const isOnline = newFriend.isOnline
    isOnline
      ? newFriendsList.online.push(newFriend)
      : newFriendsList.offline.push(newFriend)

    set({ friends: newFriendsList })
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

  reset() {
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
