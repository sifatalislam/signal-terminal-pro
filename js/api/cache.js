/**
 * ============================================================================
 * Signal Terminal Pro
 * Cache Service
 * ============================================================================
 */

import { APP_CONFIG } from "../config.js";
import { storage } from "./storage.js";
import { logger } from "../core/logger.js";

class Cache {

    constructor() {
        this.memory = new Map();
    }

    /**
     * Store an item in memory and persistent storage.
     *
     * @param {string} key
     * @param {*} value
     * @param {number} ttl
     */
    set(key, value, ttl = APP_CONFIG.cache.ttl) {

        const expires = Date.now() + ttl;

        const entry = {
            value,
            expires
        };

        this.memory.set(key, entry);

        storage.set(key, entry);

        return value;
    }

    /**
     * Retrieve an item.
     *
     * @param {string} key
     * @returns {*|null}
     */
    get(key) {

        const now = Date.now();

        // Check memory first
        if (this.memory.has(key)) {

            const entry = this.memory.get(key);

            if (entry.expires > now) {
                return entry.value;
            }

            this.memory.delete(key);
        }

        // Fallback to local storage
        const stored = storage.get(key);

        if (!stored) {
            return null;
        }

        if (stored.expires <= now) {

            storage.remove(key);

            return null;
        }

        this.memory.set(key, stored);

        return stored.value;
    }

    /**
     * Determine whether a valid cache entry exists.
     *
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Remove one cache entry.
     *
     * @param {string} key
     */
    remove(key) {

        this.memory.delete(key);

        storage.remove(key);
    }

    /**
     * Clear every cache entry.
     */
    clear() {

        this.memory.clear();

        storage.clear();

        logger.info("Cache cleared.");
    }

    /**
     * Remove expired memory entries.
     */
    cleanup() {

        const now = Date.now();

        for (const [key, entry] of this.memory.entries()) {

            if (entry.expires <= now) {
                this.memory.delete(key);
            }

        }

    }

}

export const cache = new Cache();