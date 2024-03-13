"use client"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import { Header, Section } from "../chat_app"
import { Button } from "../ui/button"
import { AddFriendForm } from "./add_friend_form"
import { FriendRequestsList } from "./friend_requests_list"

export function FriendRequests() {
  return (
    <Section className="sticky right-0 top-0 h-dvh">
      <Header className="justify-between">
        <h2 className=" text-lg font-bold lg:text-xl">Friend Requests</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="h-7 px-3 font-bold">
              Add Friend
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddFriendForm />
          </DialogContent>
        </Dialog>
      </Header>

      <FriendRequestsList />
    </Section>
  )
}
