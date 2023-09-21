# Mineflayer Anti-AFK Plugin

A plugin to add multiple anti-afk features to a bot.

## Features

- Auto message: Automatically send chat messages at a specified interval.
- Rotate: Rotate the bot's view in a specified direction at a specified interval.
- Circle walk: Make the bot walk in a circle with a specified radius and number of points.
- Sneak: Make the bot sneak for a specified amount of time at a specified interval.
- Jump: Make the bot jump at a specified interval.
- Hit: Make the bot hit nearby entities at a specified interval.

## Usage

```js
import { createBot } from 'mineflayer'
import { antiAfk } from 'mineflayer-anti-afk'

const bot = createBot({
    username: 'i_afk_for_fun'
})
bot.loadPlugin(antiAfk) // also loads mineflayer-pathfinder
```

Then, you can use the plugin:

```ts
// send 'Hello, world!' every 5s
bot.antiAfk.autoMessage(['Hello, world!'], 5000)

// you can also provide your own chat function
function customChatFunction(msg: string) {
    // classified information
}
// and provide multiple messages
bot.antiAfk.autoMessage([
    `"guys this guy is afk ban him he's taking a precious player slot" - NERD EMOJI irl`,
    'HOW MANY TIMES do i have to tell you IM NOT AFK',
    'im just a regular player bro relax'
], 30000, customChatFunction)


// rotate the bot's view 1 degree to the right every 100ms
bot.antiAfk.rotate('right', 1, 100)

// walk in a circle with a radius of 10 blocks and 8 points
bot.antiAfk.circleWalk(10, 8)

// sneak for 500ms every 500ms
bot.antiAfk.sneak(500, 500)

// jump every 1s
bot.antiAfk.jump(1000)

// attack nearby mobs
bot.antiAfk.hit({ attackMobs: true })
// or just swing right arm every 2s
bot.antiAfk.hit({ interval: 2000 })
```

Then you can toggle them off:

```js
console.log(bot.antiAfk.status) // { autoMessage: true, rotate: true, ... }
bot.antiAfk.off('autoMessage') // Turns off auto message
```

## Installation

Not yet published to npm registry. What you can do though:

```bash
# download tarball directly from github and install with npm
npm install https://github.com/NoNameLmao/mineflayer-anti-afk/tarball/main
```
