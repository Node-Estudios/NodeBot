export class PerformanceMeter {
    startTime;
    endTime;
    start() {
        this.startTime = Date.now();
        return true;
    }
    stop() {
        const elapsedTime = Date.now() - this.startTime;
        return elapsedTime;
    }
}
//# sourceMappingURL=performanceMeter.js.map