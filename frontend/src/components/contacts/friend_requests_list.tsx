"use client"

import { useFriendsContext } from "@/context/friends_context"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { FriendRequest } from "./friend_request"

export function FriendRequestsList() {
  const { friendRequests } = useFriendsContext()

  return (
    <Tabs defaultValue="all" className="h-[calc(100dvh-64px)] overflow-auto">
      <TabsList className="m-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="incoming">Incoming</TabsTrigger>
        <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <ul>
          {friendRequests.outgoing.map((request) => (
            <li key={request.id + "all-outgoing"}>
              <FriendRequest
                requestId={request.id}
                user={request.receiver}
                type="outgoing"
              />
            </li>
          ))}
          {friendRequests.incoming.map((request) => (
            <li key={request.id + "all-incoming"}>
              <FriendRequest
                requestId={request.id}
                user={request.sender}
                type="incoming"
              />
            </li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="incoming">
        {friendRequests.incoming.map((request) => (
          <li key={request.id + "incoming"}>
            <FriendRequest
              requestId={request.id}
              user={request.sender}
              type="incoming"
            />
          </li>
        ))}
      </TabsContent>
      <TabsContent value="outgoing">
        {friendRequests.outgoing.map((request) => (
          <li key={request.id + "outgoing"}>
            <FriendRequest
              requestId={request.id}
              user={request.receiver}
              type="outgoing"
            />
          </li>
        ))}
      </TabsContent>
    </Tabs>
  )
}
