import { createBot } from 'mineflayer'
import { antiAfk } from './index'
import { setTimeout as sleep } from 'timers/promises'
import dotenv from 'dotenv'
dotenv.config()

const bot = createBot({
    host: process.env.SERVER_IP ?? 'localhost',
    port: Number(process.env.SERVER_PORT) ?? 25565,
    username: 'im_not_afk_guys'
})

bot.loadPlugin(antiAfk)

bot.once('spawn', async () => {
    console.log(bot.antiAfk.status)
    console.log('automessage check')
    const messages = [
        'test',
        'i was testing',
        'bad, i was testing',
        'testing what skeppy??',
        '💀📕📕',
        '📕💀🍅⚠️❌💻❔📢🗿🤤😋',
        'sacaron el crafting dupe pa siempre?',
        'jesse we need to cook',
        'чё он несёт???',
        'fetch(url, options)?? you should fetch some bi-'
    ]
    bot.antiAfk.autoMessage(messages, 1000, true)
    console.log(bot.antiAfk.status)
    await sleep(5000)
    bot.antiAfk.off('autoMessage')


    console.log('rotate check')
    bot.chat(`2. pitch and yaw before: ${bot.entity.pitch}, ${bot.entity.yaw}`)
    console.log('rotating up')
    bot.antiAfk.rotate('up', 1, 300)
    console.log(bot.antiAfk.status)

    await sleep(3000)
    bot.antiAfk.off('rotate')
    console.log('no longer rotating up')
    console.log(bot.antiAfk.status)
    console.log('rotating left')
    bot.antiAfk.rotate('left', 1, 300)
    console.log(bot.antiAfk.status)

    await sleep(3000)
    bot.antiAfk.off('rotate')
    console.log('no longer rotating left')
    console.log(bot.antiAfk.status)
    bot.chat(`2. pitch and yaw after: ${bot.entity.pitch}, ${bot.entity.yaw}`)


    console.log('circlewalk check')
    bot.chat(`3. coords before: ${bot.entity.position.x}, ${bot.entity.position.y}, ${bot.entity.position.z}`)
    bot.antiAfk.circleWalk(10, 8)
    console.log(bot.antiAfk.status)

    await sleep(10000)
    bot.antiAfk.off('circleWalk')
    console.log(bot.antiAfk.status)
    bot.chat(`3. coords after: ${bot.entity.position.x}, ${bot.entity.position.y}, ${bot.entity.position.z}`)


    console.log('sneak test')
    bot.chat('4. i need more boolets')
    bot.antiAfk.sneak(100, 100)
    console.log(bot.antiAfk.status)

    await sleep(3000)
    bot.antiAfk.off('sneak')
    console.log(bot.antiAfk.status)
    bot.chat('4. thanks for the protein sir')


    console.log('jump test')
    bot.chat('5. floor is lava? jump high enough so that by the time you land back you regen all your health, easy')
    bot.antiAfk.jump(900)
    console.log(bot.antiAfk.status)

    await sleep(10000)
    bot.antiAfk.off('jump')
    console.log(bot.antiAfk.status)


    console.log('hit test')
    bot.chat('6. im so funkin mad rn COME HERE I WILL PUNCH YOU')
    bot.antiAfk.hit({ attackMobs: true })
    console.log(bot.antiAfk.status, bot.pathfinder.goal)
    await sleep(10000)
    bot.antiAfk.off('hit')
    console.log(bot.antiAfk.status, bot.pathfinder.goal)
    bot.chat('6. ok ill punch the air then')
    bot.antiAfk.hit({ interval: 1500 })
    console.log(bot.antiAfk.status)
    await sleep(10000)
    bot.antiAfk.off('hit')
    console.log(bot.antiAfk.status)
    bot.chat('6. im tired asf bye')

})

bot.once('kicked', (reason, loggedIn) => {
    console.error(reason, loggedIn)
    process.exit(1)
})
