import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_API_URL: z.string().min(1),
    NEXT_PUBLIC_API_VERSION: z.string().min(1),
    NEXT_PUBLIC_APP_DEBUG: z
      .string()
      .min(1)
      .transform((v) => v === "true"),
  },
  server: {
    NODE_ENV: z.enum(["development", "prod", "test"]),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_DEBUG: process.env.NEXT_PUBLIC_APP_DEBUG,
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
    NODE_ENV: process.env.NODE_ENV,
  },
})
