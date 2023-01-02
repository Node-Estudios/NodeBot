import logger from "../utils/logger.js";

export class Timer {
    private startTime!: number;
    private endTime!: number;

    start(): boolean {
        this.startTime = Date.now();
        return true
    }

    stop(): number {
        const elapsedTime = Date.now() - this.startTime;
        logger.debug(elapsedTime)
        return elapsedTime;
    }
}
