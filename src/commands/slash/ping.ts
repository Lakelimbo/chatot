import { SlashCommand, SlashCommandConfig } from "@/commands/commands.d"

const config: SlashCommandConfig = {
  description: "Ping command",
  usage: "/ping",
}

const command: SlashCommand = {
  execute: async (interaction) => {
    const ping = await interaction.reply({
      content: "Pinging...",
      withResponse: true,
    })

    const responseTime =
      ping.interaction.createdTimestamp - interaction.createdTimestamp
    const latency = responseTime < 1 ? "<1" : responseTime

    await interaction.editReply(`Pong! *(${latency}ms)*`)
  },
}

export default { command, config }
