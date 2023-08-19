export class SpamIntervalDB {
    _timestamps;
    constructor() {
        this._timestamps = new Map();
    }
    addUser(user, ttl) {
        const now = Date.now();
        this._timestamps.set(user, now + ttl);
        setTimeout(() => this._timestamps.delete(user), ttl);
    }
    checkUser(user) {
        const now = Date.now();
        const expirationTimestamp = this._timestamps.get(user);
        if (!expirationTimestamp || expirationTimestamp < now) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=spamInterval.js.map