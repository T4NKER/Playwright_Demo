export class Logger {
    constructor(logLevel = 'info') {
        this.logLevel = logLevel;
        this.logLevels = { error: 0, warn: 1, info: 2, debug: 3 };
    }

    log(level, message) {
        if (this.logLevels[level] <= this.logLevels[this.logLevel]) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`);
        }
    }

    info(message) {
        this.log('info', message);
    }

    debug(message) {
        this.log('debug', message);
    }

    warn(message) {
        this.log('warn', message);
    }

    error(message) {
        this.log('error', message);
    }
}
