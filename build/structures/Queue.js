import { formatDuration } from './MusicManager.js';
export default class Queue extends Array {
    current;
    previous;
    constructor() {
        super();
        this.current = null;
        this.previous = null;
    }
    add(track, index) {
        if (!this.current)
            this.current = track;
        else if (!index || typeof index !== 'number')
            this.push(track);
        else
            this.splice(index, 0, track);
    }
    remove(index) {
        this.splice(index, 1);
    }
    clear() {
        this.splice(0);
    }
    retrieve(page) {
        return this.map((song, i) => `**${i + 1}.** [${song.title}](${song.url}) \`[${formatDuration(song.duration ?? 0)}]\` • <@${song.requester.id}>\n`);
    }
    shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            const n = Math.floor(Math.random() * (i + 1));
            [this[i], this[n]] = [this[n], this[i]];
        }
    }
    totalSize() {
        return this.length + (this.current ? 1 : 0);
    }
}
//# sourceMappingURL=Queue.js.map