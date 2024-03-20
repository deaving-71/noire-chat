"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSocket } from "@/context/socket"
import {
  FriendRequests,
  FriendsList,
  IncomingFriendRequest,
  OutgoingFriendRequest,
  User,
} from "@/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { produce } from "immer"

import { getFriendsList } from "@/lib/actions/client"

type FriendsContext = {
  friends: FriendsList
  friendRequests: FriendRequests

  appendFriend: (newFriend: User) => void
  appendIncomingRequest: (request: IncomingFriendRequest) => void
  appendOutgoingRequest: (request: OutgoingFriendRequest) => void
  removeRequest: (id: number) => void
}

const friendsContext = createContext<FriendsContext | null>(null)

export function useFriendsContext() {
  const context = useContext(friendsContext)
  if (!context) {
    throw new Error(
      "useFriendsContext must be used within a FriendsContextProvider"
    )
  }

  return context
}

export function FriendContextProvider({ children }: React.PropsWithChildren) {
  const { data } = useSuspenseQuery({
    queryKey: ["friends"],
    queryFn: getFriendsList,
  })

  const [friends, setFriends] = useState<FriendsList>(data.friends)
  const [friendRequests, setFriendRequests] = useState<FriendRequests>(
    data.friend_requests
  )
  const { ws } = useSocket()

  function appendFriend(newFriend: User) {
    setFriends(
      produce((state) => {
        newFriend.isOnline
          ? (state.online = [...state.online, newFriend])
          : [...state.offline, newFriend]
      })
    )
  }

  function appendIncomingRequest(request: IncomingFriendRequest) {
    setFriendRequests(
      produce((state) => {
        state.incoming = [...state.incoming, request]
      })
    )
  }

  function appendOutgoingRequest(request: OutgoingFriendRequest) {
    setFriendRequests(
      produce((state) => {
        state.outgoing = [...state.outgoing, request]
      })
    )
  }

  function removeRequest(id: number) {
    setFriendRequests((state) => {
      const friendsRequests = { ...state }
      friendsRequests.outgoing = friendsRequests.outgoing.filter(
        (request) => request.id !== id
      )
      friendsRequests.incoming = friendsRequests.incoming.filter(
        (request) => request.id !== id
      )

      return friendsRequests
    })
  }

  useEffect(() => {
    ws?.socket.on("friend-connected", (user: User) => {
      setFriends((friends) => {
        const newFriends = { ...friends }
        newFriends.offline = newFriends.offline.filter(
          (friend) => friend.id !== user.id
        )
        newFriends.online = [...newFriends.online, user]
        return newFriends
      })
    })

    ws?.socket.on("friend-disconnected", (user: User) => {
      setFriends((friends) => {
        const newFriends = { ...friends }
        newFriends.online = newFriends.online.filter(
          (friend) => friend.id !== user.id
        )
        newFriends.offline = [...newFriends.offline, user]
        return newFriends
      })
    })

    ws?.socket.on("friend-request:received", (data: IncomingFriendRequest) =>
      appendIncomingRequest(data)
    )

    ws?.socket.on(
      "friend-request:accepted",
      ({ requestId, user }: { user: User; requestId: number }) => {
        appendFriend(user)
        removeRequest(requestId)
      }
    )

    ws?.socket.on("friend-request:removed", (requestId: number) => {
      return removeRequest(requestId)
    })

    return () => {
      ws?.socket.off("friend-connected")
      ws?.socket.off("friend-disconnected")
      ws?.socket.off("friend-request:received")
      ws?.socket.off("friend-request:accepted")
      ws?.socket.off("friend-request:removed")
    }
  }, [])

  const contextValue = {
    friends,
    friendRequests,
    appendFriend,
    appendIncomingRequest,
    appendOutgoingRequest,
    removeRequest,
  }

  return (
    <friendsContext.Provider value={contextValue}>
      {children}
    </friendsContext.Provider>
  )
}
