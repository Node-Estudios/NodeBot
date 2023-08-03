import { GuildMember } from 'discord.js'
import { formatDuration } from './MusicManager.js'
import { type Track as yashaTrack } from 'yasha'

// @ts-expect-error
type Track = yashaTrack & { requester: GuildMember, streams: any[] | null }
export default class Queue extends Array<Track> {
    current: Track | null
    previous: Track | null
    constructor () {
        super()
        this.current = null
        this.previous = null
    }

    add (track: Track, index?: number) {
        // console.log('trackeddd', track)
        if (!this.current) this.current = track
        else if (!index || typeof index !== 'number') this.push(track)
        else this.splice(index, 0, track)
    }

    remove (index: number) {
        this.splice(index, 1)
    }

    clear () {
        this.splice(0)
    }

    retrieve (page: number) {
        return this.map((song, i) => `**${i + 1}.** [${song.title}](${song.url}) \`[${formatDuration(song.duration ?? 0)}]\` • <@${song.requester.id}>\n`)
    }

    shuffle () {
        for (let i = this.length - 1; i > 0; i--) {
            const n = Math.floor(Math.random() * (i + 1))
                ;[this[i], this[n]] = [this[n], this[i]]
        }
    }

    totalSize () {
        return this.length + (this.current ? 1 : 0)
    }
}
