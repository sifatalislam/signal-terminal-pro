/**
 * ============================================================================
 * Signal Terminal Pro
 * Storage Service
 * ============================================================================
 */

import { logger } from "../core/logger.js";

class Storage {

    constructor(prefix = "signal-terminal") {
        this.prefix = prefix;
    }

    key(name) {
        return `${this.prefix}:${name}`;
    }

    set(name, value) {

        try {

            localStorage.setItem(
                this.key(name),
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            logger.error("Storage write failed.", error);

            return false;

        }

    }

    get(name, defaultValue = null) {

        try {

            const item = localStorage.getItem(this.key(name));

            if (item === null) {
                return defaultValue;
            }

            return JSON.parse(item);

        } catch (error) {

            logger.error("Storage read failed.", error);

            return defaultValue;

        }

    }

    remove(name) {

        localStorage.removeItem(
            this.key(name)
        );

    }

    clear() {

        const prefix = `${this.prefix}:`;

        Object.keys(localStorage)
            .filter(key => key.startsWith(prefix))
            .forEach(key => localStorage.removeItem(key));

    }

    has(name) {

        return localStorage.getItem(
            this.key(name)
        ) !== null;

    }

}

export const storage = new Storage();