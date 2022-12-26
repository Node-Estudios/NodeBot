import { GuildMember } from 'discord.js'

interface YoutubeStreams {
    url: string
}
interface TrackImage {
    url: string
    width: number
    height: number
}
interface YoutubeTrack {
    platform: 'Youtube'
    playable: boolean
    duration: number
    author: string
    icons: TrackImage[]
    id: string
    title: string
    thumbnails: TrackImage[]
    requester: GuildMember
    icon: string | null
    streams: YoutubeStreams[] | null
}
export default class Queue extends Array {
    current: YoutubeTrack | null
    previous: YoutubeTrack | null
    constructor() {
        super()
        this.current = null
        this.previous = null
    }
    add(track: any, index?: number) {
        if (!this.current) this.current = track
        else if (!index || typeof index !== 'number') this.push(track)
        else this.splice(index, 0, track)
    }

    remove(index: number) {
        this.splice(index, 1)
    }

    clear() {
        this.splice(0)
    }

    shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            const n = Math.floor(Math.random() * (i + 1))
            ;[this[i], this[n]] = [this[n], this[i]]
        }
    }

    totalSize() {
        return this.length + (this.current ? 1 : 0)
    }
}
