import { GatewayIntentBits, REST, Routes } from "discord.js"

import { env } from "./env"
import { handleEvents } from "./handlers/eventHandler"
import { DiscordClient } from "./lib/client"
import { Logger } from "./lib/logger"
import { loadSlashCommands } from "./loaders/slashCommands"

const client = DiscordClient.GetInstance({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
})

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN)

;(async () => {
  try {
    Logger.Debug("Watching slash commands...")

    const { slashCommands, slashConfigs } = await loadSlashCommands()

    const res: any = await rest.put(
      Routes.applicationCommands(env.DISCORD_APP_ID),
      {
        body: slashCommands,
      }
    )

    client.SlashConfigs = slashConfigs

    Logger.Debug(`Successfully reloaded ${res.length} (/) commands`)
    client.login(env.DISCORD_BOT_TOKEN)
  } catch (err) {
    Logger.Error(`Error refreshing application (/) commands: \n\t${err}`)
  }
})()

handleEvents()
