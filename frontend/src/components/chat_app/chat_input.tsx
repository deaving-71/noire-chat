"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export type ChatInputProps = {
  sendMessage: (content: string) => void
  onInputFocus?: Function
}

const formSchema = z.object({
  content: z.string().min(1),
})

export function ChatInput({ sendMessage, onInputFocus }: ChatInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  function onSubmit({ content }: z.infer<typeof formSchema>) {
    form.setValue("content", "")
    sendMessage(content)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="pb-3] bg-background px-3"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl className="flex items-center gap-3 ">
                <div>
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    onFocus={() => {
                      onInputFocus && onInputFocus()
                    }}
                    {...field}
                  />
                  <Button size="icon" disabled={!form.formState.isValid}>
                    <Icons.send size={18} />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
