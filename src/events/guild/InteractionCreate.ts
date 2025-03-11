import { SlashCommand, SlashCommandInteraction } from "@/commands/commands.d"
import { CacheType, Interaction } from "discord.js"

import { DiscordClient } from "@/lib/client"
import { Logger } from "@/lib/logger"

/**
 * Executes a slash command
 *
 * @param commandName Name of the command
 * @param interaction Interaction object
 */
async function executeSlashCommand(
  commandName: string,
  interaction: SlashCommandInteraction
) {
  try {
    const client = interaction.client as DiscordClient
    const commandConfig = client.SlashConfigs.find(
      (command) => command.name === commandName
    )

    if (!commandConfig) {
      Logger.Warn(`Slash command ${commandName} not found.`)

      await interaction.reply({
        content: "Unavailable command.",
        flags: "Ephemeral",
      })
      return
    }

    const rawModule = await import(
      `../../commands/slash/${commandConfig.fileName}`
    )
    const { command }: { command: SlashCommand } = (
      rawModule.default?.default ? rawModule.default : rawModule
    ).default

    await command.execute(interaction)
  } catch (err) {
    Logger.Error(`Error executing slash command "${commandName}": \n\t${err}`)

    await interaction.reply({
      content: "Error executing command",
      flags: "Ephemeral",
    })
  }
}

export default async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName } = interaction

  await executeSlashCommand(commandName, interaction)
}
