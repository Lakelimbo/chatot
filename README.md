# Chatot - Bulbagarden Discord bot

_Chatot_ is a Discord bot primarily made for [Bulbapedia](https://bulbapedia.bulbagarden.net) and [Bulbagarden Archives](https://archives.bulbagarden.net). It helps by intercepting wiki links while also having useful commands for quick information about the wiki.

## Cheatsheet

### Message commands

There are a few message commands, which returns the most suitable result found on Bulbapedia or Bulbagarden Archives:

| Syntax              | Example               | Description                                                                            |
| ------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| `[[<name>]]`        | `[[pikachu]]`         | Returns articles, categories, or help pages on Bulbapedia                              |
| `[[File:<name>]]`   | `[[file:chesnaught]]` | Returns files on Bulbagarden Archives. You do not necessarily need the file extension. |
| `{{<name>}}`        | `{{typeIcon}}`        | Returns a template on Bulbapedia                                                       |
| `{{Module:<name>}}` | `{{module:kanban}}`   | Returns a Lua module on Bulbapedia                                                     |

### Slash commands

- `/revid`: Get a specific revision
  - **id**: ID of this revision
- `/search`: Search on Bulbapedia
  - **title**: title for the search
- `/ping`: Ping command for development purposes

## Technical details

### Requirements

- Node.js >= v20
- PNPM >= v10

### Running Chatot

```sh
# development
pnpm dev

# build
pnpm build

# start in production
pnpm start

# general formatting
pnpm format
```

## Credits

- Hero of Light (formerly Bulbatech)
- KenderCharmeleon
- Originally based on [dan5py](https://github.com/dan5py/discordjs-template-ts)'s template
