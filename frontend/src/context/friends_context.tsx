"use client"

import { request } from "http"
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
    setFriends((state) => {
      const status = newFriend.isOnline ? "online" : "offline"
      const newFriendsList = { ...state }
      newFriendsList[status].push(newFriend)
      return newFriendsList
    })
  }

  function appendIncomingRequest(request: IncomingFriendRequest) {
    setFriendRequests((state) => ({
      outgoing: [...state.outgoing],
      incoming: [...state.incoming, request],
    }))
  }

  function appendOutgoingRequest(request: OutgoingFriendRequest) {
    setFriendRequests((state) => ({
      outgoing: [...state.outgoing, request],
      incoming: [...state.incoming],
    }))
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
