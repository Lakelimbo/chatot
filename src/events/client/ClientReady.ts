import { PresenceUpdateStatus } from "discord.js"

import { DiscordClient } from "@/lib/client"
import { Logger } from "@/lib/logger"

export default async (client: DiscordClient) => {
  client.user?.setStatus(PresenceUpdateStatus.Online)

  Logger.Info(`Logged in as ${client.user?.tag}.`)
}
