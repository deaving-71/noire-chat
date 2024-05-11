"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

import { errorHandler } from "@/lib/error_handler"
import { useSignUp } from "@/hooks/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { H1 } from "@/components/common"

export const formSchema = z
  .object({
    username: z.string().min(1, "Please enter a valid username"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Please enter a valid password"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

export default function SignUpPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirm_password: "",
    },
  })

  const router = useRouter()

  const signup = useSignUp({
    onSuccess: () => {
      toast.success("Your account was successfuly created.", { duration: 2000 })
      router.push("/auth/sign-in")
    },
    onError: (error) => {
      errorHandler(error, (parsedError) => {
        parsedError.errors.forEach((err) => {
          const { field, message } = err
          form.setError(`root.${field}`, { message })
          if (field === "root") form.setError("root", { message })
        })
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (signup.isPending) return
    signup.mutate(values)
  }

  return (
    <div className="w-[520px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border p-5"
        >
          <div className="space-y-2 text-center">
            <H1 className="!text-2xl  font-medium">Create an account</H1>
            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full text-base"
            disabled={!form.formState.isValid || signup.isPending}
          >
            {signup.isPending ? (
              <span className="*:inline">Signing up...</span>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <span>Already have an account? </span>
            <Link
              href="/auth/sign-in"
              className=" text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
