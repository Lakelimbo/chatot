import { SlashCommand, SlashCommandConfig } from "@/commands/commands.d"

import { WikiContent } from "@/lib/fetch/wiki-content"
import { Logger } from "@/lib/logger"

const config: SlashCommandConfig = {
  description: "Gets a Pokémon species",
  usage: "/species",
  options: [
    {
      name: "name",
      description: "Name of the Pokémon",
      type: "STRING",
      required: true,
    },
  ],
}

const wiki = new WikiContent()

const command: SlashCommand = {
  execute: async (interaction) => {
    await interaction.deferReply()

    const title = interaction.options.get("name", true)
    Logger.Debug(`/species for "${title.value}"`)

    try {
      const page = await wiki.getSpecies(title.value as string)

      await interaction.editReply({
        embeds: [
          {
            title: `${page.name} (${page.ndex})`,
            // url: `${env.WIKI_URL}/wiki/${page.name} (Pokémon)`,
            thumbnail: page.image,
            color: page.color,
            fields: [
              {
                name: "Category",
                value: page.category,
              },
              {
                name: page.types.length > 1 ? "Types" : "Type",
                value: `${page.types.map((type) => ` ${type}`)}`,
              },
              {
                name: page.abilities.length > 1 ? "Abilities" : "Ability",
                value: `${page.abilities?.map((ability) => ` ${ability}`)}`,
              },
            ],
          },
        ],
      })
    } catch (err) {
      console.log(err)

      await interaction.editReply({
        content: `🤔 Could not find a Pokémon by the name of *${title.value}*.`,
      })
    }
  },
}

export default { command, config }
