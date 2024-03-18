"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useFriendsContext } from "../../context/friends_context"
import { ContactUser } from "./contact_user"
import { Count } from "./count"

export function ContactList() {
  const { friends } = useFriendsContext()

  const onlineFriendsCount = friends.online.length
  const offlineFriendsCount = friends.offline.length
  const allFriendsCount = onlineFriendsCount + offlineFriendsCount

  return (
    <Tabs defaultValue="all">
      <TabsList className="m-4">
        <TabsTrigger value="all">
          All <Count count={allFriendsCount} />
        </TabsTrigger>
        <TabsTrigger value="online">
          Online <Count count={onlineFriendsCount} />
        </TabsTrigger>
        <TabsTrigger value="offline">
          Offline
          <Count count={offlineFriendsCount} />
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
