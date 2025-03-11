export type WikiRequest<T = Record<string, string>> = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  params?: T
  body?: unknown
  headers?: Record<string, string>
}

interface BaseResponse {
  id: number
  key: string
  title: string
}

export interface WikiSearchResult extends BaseResponse {
  excerpt: string
  matched_title?: string
  description?: string
  thumbnail?: {
    url: string
    width: number
    height: number
    duration?: number
    mimetype: string
  }
}

export interface WikiPageMeta {
  views?: number
  watchers?: number
  interactions?: number
  last_edit?: Date
}

export interface WikiUser {
  name: string
  id: number
}

export interface WikiRevision {
  id: number
  timestamp: Date
  comment?: string
  minor: boolean
  size: number
  delta?: number
  content_model: ContentModel
  page: Pick<WikiPage, "id" | "key" | "title">
  user: WikiUser
  comment?: string
}

export type ContentModel = "wikitext" | "css" | "javascript" | "lua" | "json"

export type RevisionParams = {
  older_than?: number
  newer_than?: number
  limit?: number
  filter?: "reverted" | "anonymous" | "bot" | "minor"
}

export type RevisionCountType =
  | "anonymous"
  | "bot"
  | "editors"
  | "minor"
  | "reverted"

export type RevisionCountParams = {
  from?: number
  to?: number
}

export interface WikiPage extends BaseResponse {
  latest: {
    id: number
    timestamp: Date
  }
  content_model: "wikitext" | "javascript" | "css" | "json"
  title: string
  html_url: string
  source: string
  license: {
    url: string
    title: string
  }[]
  meta?: WikiPageMeta
}

export interface WikiLanguageLink {
  code: string
  name: string
  key: string
  title: string
}

export type LanguageLinkParams = {
  title: string
}

export interface WikiMediaDetails {
  size: number
  width?: number
  height?: number
  duration?: number
  url: string
  mime: string
  mediatype: "BITMAP" | "DRAWING" | "AUDIO" | "VIDEO" | "MULTIMEDIA" | "OTHER"
}

export interface WikiMedia {
  title: string
  file_description_url: string
  latest: {
    timestamp: Date
    user?: WikiUser
  }
  preferred: WikiMediaDetails
  original: WikiMediaDetails
  thumbnail?: WikiMediaDetails
}

export type MediaParams = {
  title: string
}

export interface WikiSearchResponse {
  pages: WikiSearchResult[]
}
