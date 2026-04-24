import { SlashCommand, SlashCommandConfig } from "@/commands/commands.d"
import { env } from "@/env"

import { WikiFetch } from "@/lib/fetch/wiki"
import { Logger } from "@/lib/logger"

const config: SlashCommandConfig = {
  description: "Get a specific revision through its ID",
  usage: "/revid",
  options: [
    {
      name: "id",
      description: "Revision ID",
      type: "INTEGER",
      required: true,
    },
  ],
}

const wiki = new WikiFetch()

const command: SlashCommand = {
  execute: async (interaction) => {
    await interaction.deferReply()

    const id = interaction.options.get("id", true)
    Logger.Debug(`/revid for "${id.value}"`)

    try {
      const rev = await wiki.getRevisionID(id.value as number)

      const date = new Date(rev.timestamp).toLocaleDateString("en-UK", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      await interaction.editReply({
        embeds: [
          {
            url: `${env.WIKI_URL}/w/index.php?title=${rev.page.key}&oldid=${rev.id}`,
            title: `Revision ID ${rev.id}`,
            fields: [
              {
                name: "Page",
                value: rev.page.title,
                inline: true,
              },
              {
                name: "Date",
                value: `${date} (UTC)`,
                inline: true,
              },
              {
                name: "User",
                value: rev.user.name,
                inline: true,
              },
              {
                name: "Minor edit",
                value: rev.minor ? "Yes" : "No",
                inline: true,
              },
              {
                name: "Size",
                value: `${rev.delta ?? 0} bytes (${rev.size} bytes total)`,
                inline: true,
              },
            ],
            description: rev.comment && `*${rev.comment}*`,
            timestamp: `${rev.timestamp}`,
            color: 0xffff00,
          },
        ],
      })
    } catch (err) {
      Logger.Error(`/revid error for "${id.value}"`, err)

      await interaction.editReply({
        content: `An error happened. Please try again.`,
      })
    }
  },
}

export default { command, config }
