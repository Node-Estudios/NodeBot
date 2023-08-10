import { Collection } from 'discord.js'
import Button from '#structures/Button.js'

class ButtonCache {
    private static instance: ButtonCache
    private readonly cache: Collection<string | RegExp, Button>

    private constructor () {
        this.cache = new Collection<string, Button>()
    }

    public static getInstance (): ButtonCache {
        if (!ButtonCache.instance) {
            ButtonCache.instance = new ButtonCache()
        }
        return ButtonCache.instance
    }

    public getCache (): Collection<string | RegExp, Button> {
        return this.cache
    }
}

export default ButtonCache.getInstance()
