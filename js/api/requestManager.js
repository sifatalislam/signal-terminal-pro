/**
 * ============================================================================
 * Signal Terminal Pro
 * Request Manager
 * ============================================================================
 */

import { cache } from "./cache.js";
import { logger } from "../core/logger.js";

class RequestManager {

    constructor() {

        this.pending = new Map();

        this.stats = {
            total: 0,
            cacheHits: 0,
            networkRequests: 0,
            sharedRequests: 0
        };

    }

    /**
     * Execute a request.
     *
     * @param {string} key
     * @param {Function} request
     * @param {number} ttl
     * @returns {Promise<any>}
     */
    async execute(key, request, ttl) {

        this.stats.total++;

        const cached = cache.get(key);

        if (cached !== null) {

            this.stats.cacheHits++;

            logger.debug(`Cache hit: ${key}`);

            return cached;

        }

        if (this.pending.has(key)) {

            this.stats.sharedRequests++;

            logger.debug(`Shared request: ${key}`);

            return this.pending.get(key);

        }

        this.stats.networkRequests++;

        const promise = (async () => {

            try {

                const result = await request();

                cache.set(key, result, ttl);

                return result;

            } finally {

                this.pending.delete(key);

            }

        })();

        this.pending.set(key, promise);

        return promise;

    }

    /**
     * Get statistics.
     */
    getStats() {

        return structuredClone(this.stats);

    }

    /**
     * Number of active requests.
     */
    active() {

        return this.pending.size;

    }

}

export const requestManager = new RequestManager();