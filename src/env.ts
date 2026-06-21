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

  // if at some point these options grow too much, I'll try to
  // add a way to read a configuration file, since these aren't
  // sensitive values
  ENABLE_REGULAR_WIKILINKS: z.boolean().default(true),
  ENABLE_FILE_LINKS: z.boolean().default(true),
  ENABLE_TEMPLATE_LINKS: z.boolean().default(false),
  ENABLE_MODULE_LINKS: z.boolean().default(false),
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
export type EnvSchema = z.ZodObject<typeof envSchema.shape>
