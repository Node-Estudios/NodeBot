import { readdirSync } from 'node:fs'
import client from '../bot.js'

for (const category of readdirSync('./build/events'))
    for (const file of readdirSync(`./build/events/${category}`))
        client.on(file.split('.')[0], (await import(`../events/${category}/${file}`)).default)
