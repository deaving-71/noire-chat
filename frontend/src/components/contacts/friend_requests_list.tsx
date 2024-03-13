"use client"

import { useFriends } from "@/stores/friends"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { FriendRequest } from "./friend_request"

export function FriendRequestsList() {
  const { friend_requests } = useFriends()

  return (
    <Tabs defaultValue="all" className="h-[calc(100dvh-64px)] overflow-auto">
      <TabsList className="m-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="incoming">Incoming</TabsTrigger>
        <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <ul>
          {friend_requests.outgoing.map((request) => (
            <li key={request.id + "all-outgoing"}>
              <FriendRequest
                requestId={request.id}
                user={request.receiver}
                type="outgoing"
              />
            </li>
          ))}
          {friend_requests.incoming.map((request) => (
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
        {friend_requests.incoming.map((request) => (
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
        {friend_requests.outgoing.map((request) => (
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
