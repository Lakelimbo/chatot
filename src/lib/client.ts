import { SlashCommandConfig } from "@/commands/commands.d"
import { Client, ClientOptions } from "discord.js"

export class DiscordClient extends Client {
  private static _instance: DiscordClient
  public SlashConfigs: SlashCommandConfig[] = []

  private constructor(options: ClientOptions) {
    super(options)
  }

  /**
   * This will get the current instance of the Discord client, and if
   * the instance is undefined, a new one will be invoked.
   *
   * @param options Discord client options
   * @returns Discord's client instance
   */
  public static GetInstance(
    options: ClientOptions = { intents: [] }
  ): DiscordClient {
    if (!DiscordClient._instance) {
      DiscordClient._instance = new DiscordClient(options)
    }

    return DiscordClient._instance
  }
}
