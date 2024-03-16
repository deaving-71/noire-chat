import { Channel, ChannelMembers, ChannelMessage } from "@/types"
import { produce } from "immer"
import { z } from "zod"
import { create } from "zustand"

import { channelQueryDataSchema } from "@/lib/actions/client"

type UseChannels = {
  channels: Channel[]
  setChannels(channels: Channel[]): void
}

export const useChannels = create<UseChannels>((set) => ({
  channels: [],
  setChannels: (channels) => set({ channels }),
}))

type UseChannel = {
  channel: Channel | null
  members: ChannelMembers
  messages: ChannelMessage[]

  setData(data: z.infer<typeof channelQueryDataSchema>): void
  appendMessage(message: ChannelMessage): void
  reset(): void
}

export const useChannel = create<UseChannel>((set) => ({
  channel: null,
  members: {
    online: [],
    offline: [],
  },
  messages: [],

  setData(data) {
    set({
      channel: data.channel,
      members: data.members,
      messages: data.messages,
    })
  },

  appendMessage(message) {
    set((state) => {
      const newMessages = [...state.messages, message]
      return {
        messages: newMessages,
      }
    })
  },

  reset() {
    set({ channel: null })
  },
}))
