"use client"

import { useGetFriendsQuery } from "@/hooks/friends"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Count } from "./count"
import { FriendRequest } from "./friend_request"

export function FriendRequestsList() {
  const { data } = useGetFriendsQuery()
  const { friend_requests } = data

  const incomingRequestsCount = friend_requests.incoming.length
  const outgoingRequestsCount = friend_requests.outgoing.length
  const allRequestsCount = incomingRequestsCount + outgoingRequestsCount

  return (
    <Tabs defaultValue="all" className="h-[calc(100dvh-64px)] overflow-auto">
      <TabsList className="m-4">
        <TabsTrigger value="all">
          All <Count count={allRequestsCount} />
        </TabsTrigger>
        <TabsTrigger value="incoming">
          Incoming <Count count={incomingRequestsCount} />
        </TabsTrigger>
        <TabsTrigger value="outgoing">
          Outgoing <Count count={outgoingRequestsCount} />
        </TabsTrigger>
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
