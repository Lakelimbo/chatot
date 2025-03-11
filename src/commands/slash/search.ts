import { SlashCommand, SlashCommandConfig } from "@/commands/commands.d"
import { env } from "@/env"

import { WikiFetch } from "@/lib/fetch/wiki"
import { Logger } from "@/lib/logger"

const config: SlashCommandConfig = {
  description: "Searches for pages on Bulbapedia",
  usage: "/search",
  options: [
    {
      name: "title",
      description: "Title to search",
      type: "STRING",
      required: true,
    },
  ],
}

const wiki = new WikiFetch()

const command: SlashCommand = {
  execute: async (interaction) => {
    await interaction.deferReply()

    const title = interaction.options.get("title", true)
    Logger.Debug(`/search for "${title.value}"`)

    try {
      const pages = await wiki.searchPages(title.value as string)
      const list = pages.map(
        (page) => `- [${page.title}](${env.WIKI_URL}/wiki/${page.key})`
      )

      const searchMore = `\n[You can also try searching on Bulbapedia itself.](${env.WIKI_URL}/w/index.php?title=Special:Search&search=${title.value}&fulltext=Search)`
      list.push(searchMore)

      await interaction.editReply({
        content:
          // -1 because we pushed `searchMore` to the `list` before
          // therefore, initially, length = 1
          list.length - 1 > 0
            ? `Some search results for *${title.value}*:\n${list.join("\n")}`
            : `No results found.${searchMore}`,
        flags: "SuppressEmbeds",
      })
    } catch (err) {
      Logger.Error(`/search error for "${title.value}"`, err)

      await interaction.editReply({
        content: `An error happened. Please try again.`,
      })
    }
  },
}

export default { command, config }
