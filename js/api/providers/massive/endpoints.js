/**
 * ============================================================================
 * Signal Terminal Pro
 * Massive Endpoint Builder
 * ============================================================================
 */

import { APP_CONFIG } from "../../../config.js";
import { MassiveValidationError } from "./errors.js";

export class MassiveEndpoints {

    constructor() {

        this.baseUrl = APP_CONFIG.api.baseUrl;

        this.timeframes = Object.freeze({

            "1m":  { multiplier: 1,  timespan: "minute" },
            "2m":  { multiplier: 2,  timespan: "minute" },
            "3m":  { multiplier: 3,  timespan: "minute" },
            "5m":  { multiplier: 5,  timespan: "minute" },
            "10m": { multiplier: 10, timespan: "minute" },
            "15m": { multiplier: 15, timespan: "minute" },
            "30m": { multiplier: 30, timespan: "minute" },

            "1h":  { multiplier: 1, timespan: "hour" },
            "4h":  { multiplier: 4, timespan: "hour" },

            "1d":  { multiplier: 1, timespan: "day" }

        });

    }

    /**
     * Get timeframe configuration.
     *
     * @param {string} timeframe
     * @returns {Object}
     */
    getTimeframe(timeframe) {

        const config = this.timeframes[timeframe];

        if (!config) {

            throw new MassiveValidationError(
                `Unsupported timeframe: ${timeframe}`
            );

        }

        return config;

    }

    /**
     * Build aggregate candle endpoint.
     *
     * @param {Object} options
     * @returns {string}
     */
    candles(options) {

        const {

            symbol,
            timeframe,
            from,
            to,
            limit = 5000

        } = options;

        if (!symbol) {
            throw new MassiveValidationError("Symbol is required.");
        }

        if (!from || !to) {
            throw new MassiveValidationError(
                "Both 'from' and 'to' are required."
            );
        }

        const tf = this.getTimeframe(timeframe);

        return (
            `${this.baseUrl}` +
            `/v2/aggs/ticker/${encodeURIComponent(symbol)}` +
            `/range/${tf.multiplier}/${tf.timespan}` +
            `/${from}/${to}` +
            `?adjusted=true` +
            `&sort=asc` +
            `&limit=${limit}`
        );

    }

    /**
     * Previous close endpoint.
     *
     * @param {string} symbol
     * @returns {string}
     */
    previousClose(symbol) {

        if (!symbol) {
            throw new MassiveValidationError("Symbol is required.");
        }

        return (
            `${this.baseUrl}` +
            `/v2/aggs/ticker/${encodeURIComponent(symbol)}/prev`
        );

    }

    /**
     * Market status endpoint.
     *
     * @returns {string}
     */
    marketStatus() {

        return `${this.baseUrl}/v1/marketstatus/now`;

    }

}