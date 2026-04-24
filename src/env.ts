import dotenv from "dotenv"
import { z } from "zod"

import { Logger } from "./lib/logger"

dotenv.config()

const envSchema = z.object({
  DISCORD_BOT_TOKEN: z.string(),
  DISCORD_APP_ID: z.string(),
  IS_DEVELOPMENT: z.string().transform((value) => {
    const lower = value.toLowerCase()

    if (lower === "true" || lower === "1") {
      return true
    }

    return false
  }),
  GUILD_ID: z.string().optional(),
  WIKI_URL: z.url(),
  NODE_ENV: z.string(),
})

function parseEnv(schema: z.ZodObject<typeof envSchema.shape>) {
  try {
    return schema.parse(process.env)
  } catch (err) {
    if (!(err instanceof z.ZodError)) {
      Logger.Error(err)
      process.exit(1)
    }

    console.error("Invalid environment variables:", z.treeifyError(err))
    process.exit(1)
  }
}

export const env = parseEnv(envSchema)
