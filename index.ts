import { pathfinder, goals } from 'mineflayer-pathfinder'
import { Bot } from 'mineflayer'
export function antiAfk(bot: Bot) {
    if (!bot.pathfinder) bot.loadPlugin(pathfinder)
    let status = {
        rotate: false,
        autoMessage: false,
        circleWalk: false,
        sneak: false,
        jump: false,
        hit: false
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
        circleWalk(radius, points, pos = bot.entity.position) {
            status.circleWalk = true
            const angleStep = (2 * Math.PI) / points
            const result: Coordinates[] = []
            for (let i = 0; i < points; i++) {
                const angle = i * angleStep
                const x = pos.x + radius * Math.cos(angle)
                const y = pos.y
                const z = pos.z + radius * Math.sin(angle)
                result.push({ x, y, z })
            }
            let i = 0
            const intervalId = setInterval(() => {
                if (!status.circleWalk) {
                    clearInterval(intervalId);
                    return;
                }
                if (i === result.length) i = 0
                bot.pathfinder.setGoal(new goals.GoalXZ(result[i].x, result[i].z))
                i++
            }, 1000)
        },
        sneak(sneakTime = 500, interval = 500) {
            status.sneak = true
            let sneakIntervalId = setInterval(() => {
                if (!status.sneak) {
                    clearInterval(sneakIntervalId)
                    return
                }
                bot.setControlState('sneak', true)
                setTimeout(() => {
                    bot.setControlState('sneak', false)
                }, sneakTime)
            }, interval)
        },
        jump(interval) {
            status.jump = true
            let jumpIntervalId = setInterval(() => {
                if (!status.jump) {
                    clearInterval(jumpIntervalId)
                    return
                }
                bot.setControlState('jump', true)
                setTimeout(() => {
                    bot.setControlState('jump', false)
                }, interval)
            }, interval)
        },
        hit({ attackMobs, interval = 1000 }) {
            status.hit = true
            if (attackMobs) {
                const excludedTypes = ['object', 'player', 'global', 'orb', 'other']
                const closestMob = bot.nearestEntity(entity => !excludedTypes.includes(entity.type))
                if (closestMob) bot.attack(closestMob)
            } else {
                const hitIntervalId = setInterval(() => {
                    if (!status.hit) {
                        clearInterval(hitIntervalId)
                        return
                    }
                    bot.swingArm('right', true)
                }, interval)
            }
        }
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
            /**
             * Makes the bot walk in a circle with the specified radius, number of points, and position
             * @param {number} radius The radius of the circle
             * @param {number} points The number of points in the circle
             * @param {Coordinates} pos The position of the circle's center. Defaults to `bot.entity.position`
             */
            circleWalk: (radius: number, points: number, pos: Coordinates) => void
            /**
             * Make the bot sneak for "sneakTime" every "interval" milliseconds
             * @param sneakTime How long for the bot to sneak every time
             * @param interval Frequency of the sneaking, in milliseconds
             */
            sneak: (sneakTime?: number, interval?: number) => void
            /**
             * Makes the bot jump every *interval* milliseconds
             * @param {number} interval Delay between each jump (in milliseconds)
             */
            jump: (interval: number) => void
            /**
             * Makes the bot hit mobs or swing arm based on the parameters provided
             * @param {Object} options Options for the hit function
             * @param {boolean} options.attackMobs If true, the bot will attack the nearest mob
             * @param {number} options.interval If attackMobs is false, the bot will swing its arm every interval milliseconds. Defaults to 1000 if neither parameters were provided.
             */
            hit: ({ attackMobs, interval = 1000 }: { attackMobs?: boolean, interval?: number }) => void
        }
    }
}

type Coordinates = { x: number, y: number, z: number }
type RotateDirection = 'up' | 'down' | 'left' | 'right'
type Module = 'autoMessage' | 'rotate' | 'circleWalk' | 'sneak' | 'jump' | 'hit'
