import fs from "fs"
import path from "path"
import { Events, type Awaitable } from "discord.js"

import { DiscordClient } from "@/lib/client"
import { Logger } from "@/lib/logger"

const eventSubdirectories = ["client", "guild"] as const

export function handleEvents() {
  const client = DiscordClient.GetInstance()

  const loadEvents = async (dir: string) => {
    let loadedEvents = 0

    const eventFiles = fs
      .readdirSync(path.join(__dirname, `../events/${dir}`))
      .filter(
        (file) =>
          (file.endsWith(".ts") || file.endsWith(".js")) &&
          !file.startsWith("_")
      )

    for (const file of eventFiles) {
      const eventName = file.split(".")[0] as keyof typeof Events

      // skip invalid events
      if (!(eventName in Events)) {
        Logger.Warn(`Invalid event name "${eventName}, skipping...`)
        continue
      }

      try {
        const rawModule = await import(`../events/${dir}/${file}`)
        const eventModule = rawModule.default?.default
          ? rawModule.default
          : rawModule

        if (!eventModule.default) {
          throw new Error(`Missing default export in "${file}"`)
        }

        const eventFunctioon: (...args: any[]) => Awaitable<void> =
          eventModule.default

        // @ts-expect-error
        client.on(Events[eventName], eventFunctioon)
        ++loadedEvents
      } catch (err) {
        Logger.Error(`Failed to load event "${eventName}: \n\t${err}`)
        continue
      }
    }

    return loadedEvents
  }

  eventSubdirectories.forEach(async (directory) => {
    try {
      const loadedEvents = await loadEvents(directory)
      Logger.Debug(`Loaded ${loadedEvents} events from "${directory}"`)
    } catch (err: any) {
      if (err.code === "ENOENT") {
        return
      }

      Logger.Error(`Failed to load events in ${directory}: \n\t${err}`)
    }
  })
}
