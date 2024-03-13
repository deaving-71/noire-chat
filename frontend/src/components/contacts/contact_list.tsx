"use client"

import { useEffect } from "react"
import { useFriends } from "@/stores/friends"
import { useSuspenseQuery } from "@tanstack/react-query"

import { getFriendsList } from "@/lib/actions/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ContactUser } from "./contact_user"

export function ContactList() {
  const { data } = useSuspenseQuery({
    queryKey: ["friends"],
    queryFn: getFriendsList,
  })

  const { setFriends, setFriendRequests } = useFriends()
  const { friends, friend_requests } = data

  const onlineFriendsCount = friends.online.length
  const offlineFriendsCount = friends.offline.length
  const allFriendsCount = onlineFriendsCount + offlineFriendsCount

  useEffect(() => {
    setFriends(friends)
    setFriendRequests(friend_requests)
  }, [])

  return (
    <Tabs defaultValue="all">
      <TabsList className="m-4">
        <TabsTrigger value="all">
          All {"("}
          {allFriendsCount}
          {")"}
        </TabsTrigger>
        <TabsTrigger value="online">
          Online {"("}
          {onlineFriendsCount}
          {")"}
        </TabsTrigger>
        <TabsTrigger value="offline">
          Offline {"("}
          {offlineFriendsCount}
          {")"}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <ul className="pb-4">
          {[...friends.online, ...friends.offline].map((friend) => (
            <li key={friend.id}>
              <ContactUser {...friend} />
            </li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="online">
        <ul className="pb-4">
          {friends.online.map((friend) => (
            <li key={friend.id}>
              <ContactUser {...friend} />
            </li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="offline">
        <ul className="pb-4">
          {friends.offline.map((friend) => (
            <li key={friend.id}>
              <ContactUser {...friend} />
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  )
}
