import { Message } from "discord.js"

import { MessageLink } from "@/lib/fetch/wiki-links"
import { Logger } from "@/lib/logger"

export default async (message: Message) => {
  if (message.author.bot) {
    return
  }

  try {
    if (message.content.length > 0) {
      const wikiHandler = new MessageLink(message)
      await wikiHandler.process()
    }
  } catch (error) {
    Logger.Error(`Error in MessageCreate: ${error}`)
  }
}
