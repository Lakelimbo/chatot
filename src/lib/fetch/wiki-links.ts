import { env } from "@/env"
import { Message } from "discord.js"

import { Logger } from "../logger"
import { WikiFetch } from "./wiki"

type LinkHandler = {
  pattern: RegExp
  where?: string
  transform?: (match: RegExpMatchArray) => RegExpMatchArray
  notFoundMessage?: string
  resultsMessage?: string
}

export class MessageLink {
  private message: Message
  private where: string

  // Register all link types with their patterns and handler methods
  private linkHandlers: LinkHandler[] = [
    {
      pattern: /\[\[(?![Ff]ile:)(.*?)\]\]/g,
      notFoundMessage: "🤔 Could not find any matching Bulbapedia articles.",
      resultsMessage: "Pages found in your message:",
    },
    {
      pattern: /\[\[(?:[Ff]ile):(.*?)\]\]/g,
      where: "https://archives.bulbagarden.net",
      notFoundMessage:
        "🤔 Could not find any matching files on Bulbagarden Archives.",
      resultsMessage: "Files found in your message:",
    },
    {
      pattern: /\{\{(?![Mm]odule:)(.*?)\}\}/g,
      transform: (match) => {
        const modified = [...match]
        modified[1] = `Template:${match[1]}`

        return modified as RegExpMatchArray
      },
      notFoundMessage: "🤔 Could not find any matching templates.",
      resultsMessage: "Templates found in your message:",
    },
    {
      pattern: /\{\{(?:[Mm]odule):(.*?)\}\}/g,
      transform: (match) => {
        const modified = [...match]
        modified[1] = `Module:${match[1]}`

        return modified as RegExpMatchArray
      },
      notFoundMessage: "🤔 Could not find any matching Lua modules.",
      resultsMessage: "Lua modules found in your message:",
    },
  ]

  constructor(message: Message, where: string = env.WIKI_URL) {
    this.message = message
    this.where = where
  }

  /**
   * Process all wiki links in the message
   */
  async process(): Promise<void> {
    for (const handler of this.linkHandlers) {
      // seems like matchAll always will return an object that is larger than
      // we need, so an easy way to deduplicate this is to just use a loop
      // and a Map.
      //
      // Should not make any performance difference, but if for some reason
      // someone links way too many pages (like, thousands), it might take
      // a while (but considering that's unlikely, I will ignore this).
      const cleaned = this.stripCodeBlocks(this.message.content)
      const matches = cleaned.matchAll(handler.pattern)
      const unique = new Map<string, RegExpExecArray>()
      for (const match of matches) {
        const key = match[1]

        if (!unique.has(key)) {
          unique.set(key, match)
        }
      }

      const set = [...unique.values()]

      if (set.length > 0) {
        Logger.Debug(`Found ${set.length} links matching ${handler.pattern}`)

        const currentWhere = handler.where || this.where
        await this.handle(set, handler, currentWhere)
      }
    }
  }

  /**
   * Search for wiki pages based on regex matches
   */
  private async searchResults(
    matches: RegExpMatchArray[],
    handler: LinkHandler,
    where: string
  ): Promise<Array<{ title: string; url: string }>> {
    const results: Array<{ title: string; url: string }> = []
    const wikiFetch = new WikiFetch(where)

    for (let match of matches) {
      if (handler.transform) {
        match = handler.transform(match)
      }

      const page = match[1]

      try {
        const response = await wikiFetch.searchPages(page, 1)

        if (!response || response.length === 0) {
          continue
        }

        response.forEach((res) => {
          results.push({
            title: res.title,
            url: `${where}/wiki/${res.key}`,
          })
        })
      } catch {
        Logger.Error(`Links for messages not found: ${page}`)
      }
    }

    return results
  }

  /**
   * Generic handler for all link types
   */
  async handle(
    matches: RegExpMatchArray[],
    handler: LinkHandler,
    where: string
  ): Promise<void> {
    const results = await this.searchResults(matches, handler, where)

    if (results.length === 0) {
      await this.message.reply({
        content:
          handler.notFoundMessage || "🤔 Could not find any matching content.",
        allowedMentions: { repliedUser: false },
      })
    } else if (results.length === 1) {
      await this.message.reply({
        content: `[${results[0].title}](${results[0].url})`,
        allowedMentions: { repliedUser: false },
      })
    } else {
      const linkList = results
        .map((r) => `- [${r.title}](<${r.url}>)`)
        .join("\n")
      await this.message.reply({
        content: `${handler.resultsMessage || "Results found in your message:"}\n${linkList}`,
        allowedMentions: { repliedUser: false },
      })
    }
  }

  /**
   * Simple way to take care of code blocks (inline as well)
   */
  private stripCodeBlocks(content: string): string {
    return content.replace(/```[\s\S]*?```/g, "").replace(/`.*?`/g, "")
  }
}
