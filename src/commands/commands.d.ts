import {
  CacheType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  PermissionsBitField,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
  UserContextMenuCommandInteraction,
} from "discord.js"

export type SlashCommandOption =
  | SlashCommandAttachmentOption
  | SlashCommandBooleanOption
  | SlashCommandChannelOption
  | SlashCommandIntegerOption
  | SlashCommandMentionableOption
  | SlashCommandNumberOption
  | SlashCommandRoleOption
  | SlashCommandStringOption
  | SlashCommandUserOption

export type SlashCommandInteraction =
  | ChatInputCommandInteraction<CacheType>
  | MessageContextMenuCommandInteraction<CacheType>
  | UserContextMenuCommandInteraction

export interface SlashCommand {
  permissions?: (typeof PermissionsBitField.Flags)[keyof typeof PermissionsBitField.Flags]
  execute: (interaction: SlashCommandInteraction) => Promise<void>
}

export type SlashCommandOptionConfig = {
  name?: string
  description?: string
  type: SlashCommandOptionTypes
  required?: boolean
}

export type SlashCommandOptionTypes =
  | "STRING"
  | "INTEGER"
  | "BOOLEAN"
  | "USER"
  | "CHANNEL"
  | "ROLE"
  | "MENTIONABLE"
  | "NUMBER"
  | "ATTACHMENT"

export type SlashCommandStringOptionConfig = SlashCommandOptionConfig & {
  type: "STRING"
  choices?: OptionChoice<string>[]
}

export type SlashCommandNumberOptionConfig = SlashCommandOptionConfig & {
  type: "INTEGER" | "NUMBER"
  choices?: OptionChoice<number>[]
  minValue?: number
  maxValue?: number
}

export type OptionChoice<T> = {
  name: string
  value: T
}

export interface SlashCommandConfig {
  name?: string
  description?: string
  options?: (
    | SlashCommandOptionConfig
    | SlashCommandStringOptionConfig
    | SlashCommandNumberOptionConfig
  )[]
  is_blurred?: boolean
  category?: string
  usage?: string
  fileName?: string
}
