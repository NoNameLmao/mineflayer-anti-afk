import { goals, pathfinder } from 'mineflayer-pathfinder'
import { Bot } from 'mineflayer'
export function antiAfk(bot: Bot) {
    if (!bot.pathfinder) bot.loadPlugin(pathfinder)
    bot.antiAfk = {
        status: {
            autoMessage: false,
            rotate: false
        },
        autoMessage(messages, delay) {
            this.status.autoMessage = true
            let i = 0
            let intervalId = setInterval(() => {
                if (!this.status.autoMessage) {
                    clearInterval(intervalId);
                    return;
                }
                bot.chat(`${messages[i]}`) // force string
                if (i + 1 === messages.length) i = 0
                else i++
            }, delay)
        },
        rotate(direction, increment = 1, interval = 100) {
            let yaw = bot.entity.yaw
            let pitch = bot.entity.pitch
            setInterval(() => {
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
    }
}

declare module 'mineflayer' {
    interface Bot {
        antiAfk: {
            status: {
                autoMessage: boolean
                rotate: boolean
            }
            /**
             * Automatically send messages every once in *delay* milliseconds
             * @param {string[]} messages Array of messages
             * @param {number} delay Delay inbetween each message (in milliseconds)
             */
            autoMessage: (messages: string[], delay: number) => void
            /**
             * Rotates the bot in the specified direction every *interval* milliseconds
             * @param {RotateDirection} direction Direction to rotate
             * @param {number} increment Amount to rotate each interval (default: 1)
             * @param {number} interval Delay between each rotation (in milliseconds) (default: 100)
             */
            rotate: (direction: RotateDirection, increment?: number, interval?: number) => void
        }
    }
}

type Coordinates = { x: number, y: number, z: number }
type RotateDirection = 'up' | 'down' | 'left' | 'right'
