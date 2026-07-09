/**
 * ============================================================================
 * Signal Terminal Pro
 * Moving Average Indicator
 * Version: 2.0.0
 * ============================================================================
 *
 * Abstract base class for all Moving Average indicators.
 *
 * Supported Indicators
 * --------------------
 * • SMA
 * • EMA
 * • WMA
 * • VWMA
 * • DEMA
 * • TEMA
 * • HMA
 * • KAMA
 * ============================================================================
 */

import { BaseIndicator } from "./baseIndicator.js";

export class MovingAverageIndicator extends BaseIndicator {

    /**
     * Validate moving average period.
     *
     * @param {number} period
     */
    validatePeriod(period) {

        super.validatePeriod(period);

        if (period < 2) {

            throw new RangeError(
                `${this.getName()}: period must be at least 2.`
            );

        }

    }

    /**
     * EMA multiplier.
     *
     * Formula:
     *
     * 2 / (period + 1)
     *
     * @param {number} period
     * @returns {number}
     */
    multiplier(period) {

        this.validatePeriod(period);

        return 2 / (period + 1);

    }

    /**
     * Simple Moving Average seed.
     *
     * Used by:
     *  - EMA
     *  - DEMA
     *  - TEMA
     *  - KAMA
     *
     * @param {number[]} prices
     * @param {number} period
     * @returns {number}
     */
    seed(prices, period) {

        this.validatePeriod(period);

        if (prices.length < period) {

            throw new Error(
                `${this.getName()}: insufficient prices for seed calculation.`
            );

        }

        let total = 0;

        for (let i = 0; i < period; i++) {

            total += prices[i];

        }

        return total / period;

    }

    /**
     * Sum helper.
     *
     * @param {number[]} values
     * @returns {number}
     */
    sum(values) {

        let total = 0;

        for (const value of values) {

            total += value;

        }

        return total;

    }

    /**
     * Average helper.
     *
     * @param {number[]} values
     * @returns {number}
     */
    average(values) {

        if (values.length === 0) {

            throw new Error(
                `${this.getName()}: cannot average empty array.`
            );

        }

        return this.sum(values) / values.length;

    }

    /**
     * Rolling sum.
     *
     * Used by SMA and VWMA.
     *
     * @param {number} previous
     * @param {number} remove
     * @param {number} add
     * @returns {number}
     */
    rollingSum(previous, remove, add) {

        return previous - remove + add;

    }

    /**
     * Rolling average.
     *
     * @param {number} previousSum
     * @param {number} remove
     * @param {number} add
     * @param {number} period
     * @returns {{sum:number, average:number}}
     */
    rollingAverage(previousSum, remove, add, period) {

        const sum = this.rollingSum(

            previousSum,

            remove,

            add

        );

        return {

            sum,

            average: sum / period

        };

    }

    /**
     * Slice helper.
     *
     * @param {number[]} values
     * @param {number} start
     * @param {number} length
     * @returns {number[]}
     */
    window(values, start, length) {

        return values.slice(

            start,

            start + length

        );

    }

    /**
     * Runtime initialization.
     */
    initialize() {

        super.initialize();

        this.runtime.state = {

            multiplier: null,

            period: null,

            lastValue: null

        };

    }

}