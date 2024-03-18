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
}))
