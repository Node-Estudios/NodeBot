
export class PerformanceMeter {
    private startTime!: number
    private readonly endTime!: number

    start (): boolean {
        this.startTime = Date.now()
        return true
    }

    stop (): number {
        const elapsedTime = Date.now() - this.startTime
        // logger.debug(elapsedTime)
        return elapsedTime
    }
}
