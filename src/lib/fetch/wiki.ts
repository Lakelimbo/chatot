import { env } from "@/env"

import type {
  LanguageLinkParams,
  MediaParams,
  RevisionCountParams,
  RevisionCountType,
  RevisionParams,
  WikiLanguageLink,
  WikiMedia,
  WikiPage,
  WikiRequest,
  WikiRevision,
  WikiSearchResponse,
  WikiSearchResult,
} from "./wiki.d"

/**
 * Root for some queries on MediaWiki's REST
 */
export class WikiFetch {
  private wikiUrl: string
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(
    wikiUrl: string = env.WIKI_URL,
    defaultHeaders: Record<string, string> = {}
  ) {
    this.wikiUrl = wikiUrl
    this.baseUrl = this.wikiUrl + "/w/rest.php/v1/"
    this.defaultHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...defaultHeaders,
    }
  }

  private buildUrl(endpoint?: string, params?: Record<string, string>): string {
    const url = new URL(this.baseUrl + endpoint)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return url.toString()
  }

  async fetch<T, P = Record<string, string>>(
    endpoint: string,
    options: WikiRequest<P> = {}
  ): Promise<T> {
    const { method = "GET", params, body, headers = {} } = options

    const response = await fetch(this.buildUrl(endpoint, params && params), {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`)
    }

    return response.json()
  }

  // Search
  async searchPages(
    query: string,
    limit = 10,
    offset = 0
  ): Promise<WikiSearchResult[]> {
    const response = await this.fetch<WikiSearchResponse>("search/title", {
      params: {
        q: query,
        limit: limit.toString(),
        offset: offset.toString(),
      },
    })
    return response.pages
  }

  // Page content
  async getPage(title: string): Promise<WikiPage> {
    return this.fetch<WikiPage>(`page/${encodeURIComponent(title)}`)
  }

  // Languages
  async getPageLanguages(
    title: string,
    params?: LanguageLinkParams
  ): Promise<WikiLanguageLink[]> {
    return this.fetch<WikiLanguageLink[], LanguageLinkParams>(
      `page/${encodeURIComponent(title)}/links/language`,
      { params }
    )
  }

  // Media
  async getMedia(title: string, params?: MediaParams): Promise<WikiMedia> {
    return this.fetch<WikiMedia, MediaParams>(
      `file/${encodeURIComponent(title)}`,
      { params }
    )
  }

  // History
  async getPageHistory(
    title: string,
    params?: RevisionParams
  ): Promise<WikiRevision[]> {
    return this.fetch<WikiRevision[], RevisionParams>(
      `page/${encodeURIComponent(title)}/history`,
      { params }
    )
  }

  // History counts
  async getPageHistoryCounts(
    title: string,
    type: RevisionCountType,
    params?: RevisionCountParams
  ): Promise<WikiRevision> {
    return this.fetch<WikiRevision, RevisionCountParams>(
      `page/${title}/history/count/${type}`,
      { params }
    )
  }

  // History specific ID
  async getRevisionID(id: number): Promise<WikiRevision> {
    return this.fetch<WikiRevision>(`revision/${encodeURIComponent(id)}/bare`)
  }
}
