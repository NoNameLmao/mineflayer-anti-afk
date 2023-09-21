import { pathfinder, goals } from 'mineflayer-pathfinder'
import { Bot } from 'mineflayer'
export function antiAfk(bot: Bot) {
    if (!bot.pathfinder) bot.loadPlugin(pathfinder)
    let status = {
        rotate: false,
        autoMessage: false,
        circleWalk: false
    }
    bot.antiAfk = {
        get status() {
            return {...status}
        },
        off(module) {
            status[module] = false
        },
        autoMessage(messages, delay, chat = bot.chat) {
            this.status.autoMessage = true
            let i = 0
            let intervalId = setInterval(() => {
                if (!this.status.autoMessage) {
                    clearInterval(intervalId)
                    return
                }
                chat(`${messages[i]}`) // force string
                if (i + 1 === messages.length) i = 0
                else i++
            }, delay)
        },
        rotate(direction, increment = 1, interval = 100) {
            this.status.rotate = true
            let yaw = bot.entity.yaw
            let pitch = bot.entity.pitch
            let intervalId = setInterval(() => {
                if (!this.status.rotate) {
                    clearInterval(intervalId)
                    return
                }
                switch (direction) {
                    case 'up':
                        pitch -= increment
                        break
                    case 'down':
                        pitch += increment
                        break
                    case 'left':
                        yaw -= increment
                        break
                    case 'right':
                        yaw += increment
                        break
                }
                bot.look(yaw, pitch)
            }, interval)
        },
        circleWalk(radius) {
            const { x, y, z } = bot.entity.position
            const points = [
                [x + radius, y, z],
                [x, y, z + radius],
                [x - radius, y, z],
                [x, y, z - radius],
            ]
            let i = 0
            setInterval(() => {
                if(i === points.length) i = 0
                bot.pathfinder.setGoal(new goals.GoalXZ(points[i][0], points[i][2]))
                i++
            }, 1000)
        },
    }
}

// for intellisense after inject after loading this as plugin
declare module 'mineflayer' {
    interface Bot {
        antiAfk: {
            /** Status of mineflayer-anti-afk's "modules". true = running. use `bot.antiAfk.off(module)` to toggle them off */
            readonly status: {
                autoMessage: boolean
                rotate: boolean
                circleWalk: boolean
            }
            /**
             * Turns off the specified module
             * @param {Module} module The module to turn off
             */
            off: (module: Module) => void
            /**
             * Automatically send messages every once in *delay* milliseconds
             * @param {string[]} messages Array of messages
             * @param {number} delay Delay inbetween each message (in milliseconds)
             * @param {function} chat Function to send chat messages, must accept a string as first parameter. Defaults to `bot.chat`.
             */
            autoMessage: (messages: string[], delay: number, chat: (msg: string) => any) => void
            /**
             * Rotates the bot in the specified direction every *interval* milliseconds
             * @param {RotateDirection} direction Direction to rotate
             * @param {number} increment Amount to rotate each interval (default: 1)
             * @param {number} interval Delay between each rotation (in milliseconds) (default: 100)
             */
            rotate: (direction: RotateDirection, increment?: number, interval?: number) => void
            circleWalk: (radius: number) => void
        }
    }
}

type Coordinates = { x: number, y: number, z: number }
type RotateDirection = 'up' | 'down' | 'left' | 'right'
type Module = 'autoMessage' | 'rotate'
