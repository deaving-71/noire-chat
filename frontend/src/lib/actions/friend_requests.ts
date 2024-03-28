import {
  FriendRequests,
  FriendsList,
  IncomingFriendRequest,
  OutgoingFriendRequest,
  User,
} from "@/types"
import { produce } from "immer"

type BaseData = {
  friends: FriendsList
  friend_requests: FriendRequests
}

export function appendFriend(baseData: BaseData, newFriend: User) {
  return produce(baseData, (draft) => {
    newFriend.isOnline
      ? (draft.friends.online = [...draft.friends.online, newFriend])
      : [...draft.friends.offline, newFriend]
  })
}

export function appendOutgoingFriendRequest(
  baseData: BaseData,
  request: OutgoingFriendRequest
) {
  return produce(baseData, (draft) => {
    draft.friend_requests.outgoing = [
      ...draft.friend_requests.outgoing,
      request,
    ]
  })
}
export function appendIncomingFriendRequest(
  baseData: BaseData,
  request: IncomingFriendRequest
) {
  return produce(baseData, (draft) => {
    draft.friend_requests.incoming = [
      ...draft.friend_requests.incoming,
      request,
    ]
  })
}

export function popFriendRequest(baseData: BaseData, requestId: number) {
  return produce(baseData, (draft) => {
    draft.friend_requests.outgoing = draft.friend_requests.outgoing.filter(
      (request) => request.id !== requestId
    )
    draft.friend_requests.incoming = draft.friend_requests.incoming.filter(
      (request) => request.id !== requestId
    )
  })
}
