/**
 * ============================================================================
 * Signal Terminal Pro
 * Massive HTTP Request Client
 * ============================================================================
 */

import { APP_CONFIG } from "../../../config.js";

import {
    MassiveHttpError,
    MassiveNetworkError,
    MassiveTimeoutError,
    MassiveRateLimitError,
    MassiveAuthenticationError
} from "./errors.js";

export class MassiveRequest {

    constructor() {

        this.stats = {
            requests: 0,
            retries: 0,
            failures: 0
        };

    }

    /**
     * Execute GET request.
     *
     * @param {string} url
     * @returns {Promise<Object>}
     */
    async get(url) {

        return this.request(url, {
            method: "GET"
        });

    }

    /**
     * Execute HTTP request.
     *
     * @param {string} url
     * @param {Object} options
     * @returns {Promise<Object>}
     */
    async request(url, options = {}) {

        let attempt = 0;

        while (attempt <= APP_CONFIG.api.retryAttempts) {

            try {

                this.stats.requests++;

                return await this.execute(url, options);

            }
            catch (error) {

                if (!this.shouldRetry(error, attempt)) {
                    throw error;
                }

                attempt++;

                this.stats.retries++;

                await this.sleep(
                    this.backoff(attempt)
                );

            }

        }

    }

    /**
     * Execute fetch().
     */
    async execute(url, options) {

        const controller = new AbortController();

        const timeout = setTimeout(() => {

            controller.abort();

        }, APP_CONFIG.api.requestTimeout);

        try {

            const response = await fetch(url, {

                ...options,

                signal: controller.signal,

                headers: {
                    Authorization: `Bearer ${APP_CONFIG.api.apiKey}`,
                    Accept: "application/json",
                    ...options.headers
                }

            });

            if (response.status === 401) {
                throw new MassiveAuthenticationError();
            }

            if (response.status === 429) {
                throw new MassiveRateLimitError();
            }

            if (!response.ok) {

                throw new MassiveHttpError(
                    response.status,
                    response.statusText
                );

            }

            return await response.json();

        }
        catch (error) {

            if (error.name === "AbortError") {

                throw new MassiveTimeoutError(
                    APP_CONFIG.api.requestTimeout
                );

            }

            if (error instanceof TypeError) {

                throw new MassiveNetworkError(
                    error.message
                );

            }

            throw error;

        }
        finally {

            clearTimeout(timeout);

        }

    }

    /**
     * Determine whether a request should retry.
     */
    shouldRetry(error, attempt) {

        if (attempt >= APP_CONFIG.api.retryAttempts) {

            this.stats.failures++;

            return false;

        }

        return (

            error instanceof MassiveTimeoutError ||

            error instanceof MassiveNetworkError ||

            error instanceof MassiveRateLimitError

        );

    }

    /**
     * Exponential backoff.
     */
    backoff(attempt) {

        return APP_CONFIG.api.retryDelay * Math.pow(2, attempt - 1);

    }

    /**
     * Delay helper.
     */
    sleep(ms) {

        return new Promise(resolve => {

            setTimeout(resolve, ms);

        });

    }

    /**
     * Request statistics.
     */
    getStats() {

        return structuredClone(this.stats);

    }

}