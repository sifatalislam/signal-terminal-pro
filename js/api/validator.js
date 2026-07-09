/**
 * ============================================================================
 * Signal Terminal Pro
 * Response Validator
 * ============================================================================
 */

import { logger } from "../core/logger.js";

class ResponseValidator {

    /**
     * Validate an array of candle objects.
     *
     * @param {Array} candles
     * @returns {boolean}
     */
    validateCandles(candles) {

        if (!Array.isArray(candles)) {

            logger.error("API response is not an array.");

            return false;
        }

        if (candles.length === 0) {

            logger.warn("API returned an empty candle list.");

            return false;
        }

        const timestamps = new Set();

        for (const candle of candles) {

            if (!this.validateCandle(candle)) {
                return false;
            }

            if (timestamps.has(candle.timestamp)) {

                logger.error(
                    `Duplicate candle detected: ${candle.timestamp}`
                );

                return false;
            }

            timestamps.add(candle.timestamp);
        }

        return true;
    }

    /**
     * Validate one candle.
     *
     * @param {Object} candle
     * @returns {boolean}
     */
    validateCandle(candle) {

        const required = [
            "timestamp",
            "open",
            "high",
            "low",
            "close"
        ];

        for (const field of required) {

            if (!(field in candle)) {

                logger.error(
                    `Missing candle field: ${field}`
                );

                return false;
            }

        }

        const {
            open,
            high,
            low,
            close
        } = candle;

        if (high < low) {

            logger.error("Invalid candle range.");

            return false;
        }

        if (high < open || high < close) {

            logger.error("High price invalid.");

            return false;
        }

        if (low > open || low > close) {

            logger.error("Low price invalid.");

            return false;
        }

        return true;
    }

}

export const validator = new ResponseValidator();