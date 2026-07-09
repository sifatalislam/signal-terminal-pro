/**
 * ============================================================================
 * Signal Terminal Pro
 * Logger Service
 * ============================================================================
 */

import { APP_CONFIG } from "../config.js";
import { LOG_LEVEL } from "../utils/constants.js";

class Logger {

    constructor() {
        this.debugEnabled = APP_CONFIG.app.debug;
    }

    timestamp() {
        return new Date().toISOString();
    }

    format(level, message) {
        return `[${this.timestamp()}] [${level}] ${message}`;
    }

    debug(message, ...data) {

        if (!this.debugEnabled) {
            return;
        }

        console.debug(
            this.format(LOG_LEVEL.DEBUG, message),
            ...data
        );
    }

    info(message, ...data) {

        console.info(
            this.format(LOG_LEVEL.INFO, message),
            ...data
        );
    }

    warn(message, ...data) {

        console.warn(
            this.format(LOG_LEVEL.WARN, message),
            ...data
        );
    }

    error(message, error = null) {

        console.error(
            this.format(LOG_LEVEL.ERROR, message),
            error
        );
    }

    group(title) {

        console.group(title);
    }

    groupEnd() {

        console.groupEnd();
    }

}

export const logger = new Logger();