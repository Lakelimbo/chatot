import { APIEmbedThumbnail } from "discord.js"
import { JSDOM } from "jsdom"

import { typeColors } from "../utils/colors"
import { WikiFetch } from "./wiki"
import type { WikiSearchResponse } from "./wiki.d"

export class WikiContent extends WikiFetch {
  private document: Document | null = null

  async getSpecies(name: string): Promise<SpeciesResponse> {
    const request = await this.fetch<SpeciesRequest>(
      `page/${encodeURIComponent(name)}_(Pokémon)/with_html`
    )

    const dom = new JSDOM(request.html)
    this.document = dom.window.document

    return {
      ndex: this.speciesNdex(),
      name,
      category: this.speciesCategory(),
      abilities: this.speciesAbilities(),
      image: {
        url: this.speciesImage(name),
      },
      types: this.speciesTypes().length > 0 ? this.speciesTypes() : ["Unknown"],
      color: typeColors[this.speciesTypes()[0] || "unknown"],
    }
  }

  // --- species methods ---
  private speciesNdex(): string {
    const element = this.document?.querySelector(
      'table.infobox table a[title="List of Pokémon by National Pokédex number"] > span'
    )?.textContent

    if (!element) {
      return "???"
    }

    return element
  }

  private speciesCategory(): string {
    const element = this.document?.querySelector(
      'table.infobox table a[title="Pokémon category"] > span'
    )?.textContent

    if (!element) {
      return "???"
    }

    return element
  }

  private speciesImage(name: string): string {
    const image: HTMLImageElement = this.document?.querySelector(
      `table.infobox img.mw-file-element[alt="${name}"]`
    )!

    return image.src
  }

  private speciesTypes(): string[] {
    const element = this.document?.querySelectorAll(
      "table.infobox tr:nth-child(2) span > b"
    )!

    return [...element]
      .slice(0, 2)
      .filter((type) => type.textContent !== "Unknown")
      .map((type) => type.textContent!)
  }

  private speciesAbilities(): string[] {
    const element = this.document?.querySelectorAll(
      "table.infobox tr:nth-child(3) table a > span"
    )!

    const table = [...element]
      .filter((ability) => ability.textContent !== "Cacophony")
      .map((ability) => ability.textContent!)

    return [...new Set(table)]
  }
}

type SpeciesRequest = WikiSearchResponse & {
  html: string
}

type SpeciesResponse = {
  ndex: string
  name: string
  category: string
  types: string[]
  image: APIEmbedThumbnail
  abilities: string[]
  color?: number
}
