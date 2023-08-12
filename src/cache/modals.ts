// commands.ts
import { Collection } from 'discord.js'
import Modal from '#structures/Modal.js'

class ModalCache {
    private static instance: ModalCache
    #cache: Collection<string, Modal>

    private constructor () {
        this.#cache = new Collection<string, Modal>()
    }

    static getInstance (): ModalCache {
        if (!ModalCache.instance) {
            ModalCache.instance = new ModalCache()
        }
        return ModalCache.instance
    }

    get cache (): Collection<string, Modal> {
        return this.#cache
    }
}

export default ModalCache.getInstance()
