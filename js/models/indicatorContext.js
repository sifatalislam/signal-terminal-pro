/**
 * ============================================================================
 * Signal Terminal Pro
 * Indicator Context
 * Version: 2.0.0
 * ============================================================================
 *
 * Immutable execution context for technical indicators.
 *
 * Responsibilities
 * ----------------
 * • Hold candle data
 * • Hold indicator options
 * • Lazy price extraction
 * • Cached price series
 * • Typed option access
 * • Symbol / timeframe metadata
 * ============================================================================
 */

import { PriceExtractor, PriceSource } from "../utils/priceSource.js";

export class IndicatorContext {

    constructor({

        candles,

        source = PriceSource.CLOSE,

        symbol = null,

        timeframe = null,

        timestamp = Date.now(),

        options = {}

    }) {

        if (!Array.isArray(candles)) {

            throw new TypeError(
                "IndicatorContext requires a candle array."
            );

        }

        if (!PriceExtractor.isValid(source)) {

            throw new TypeError(
                `Unsupported price source "${source}".`
            );

        }

        this._candles = Object.freeze([...candles]);

        this._source = source;

        this._symbol = symbol;

        this._timeframe = timeframe;

        this._timestamp = timestamp;

        this._options = Object.freeze({
            ...options
        });

        /*
         * Lazy cache.
         */
        this._cache = {

            prices: new Map()

        };

        Object.freeze(this);

    }

    /* -------------------------------------------------------------------------
     * Candle Access
     * ---------------------------------------------------------------------- */

    candles() {

        return this._candles;

    }

    count() {

        return this._candles.length;

    }

    isEmpty() {

        return this._candles.length === 0;

    }

    first() {

        return this._candles[0] ?? null;

    }

    latest() {

        return this._candles.at(-1) ?? null;

    }

    previous() {

        return this._candles.at(-2) ?? null;

    }

    at(index) {

        return this._candles.at(index) ?? null;

    }

    /* -------------------------------------------------------------------------
     * Price Source
     * ---------------------------------------------------------------------- */

    source() {

        return this._source;

    }

    prices(source = this._source) {

        if (this._cache.prices === null) {

            this._cache.prices = Object.freeze(

                PriceExtractor.series(

                    this._candles,

                    this._source

                )

            );

        }

        return this._cache.prices;

    }

    latestPrice() {

        const prices = this.prices();

        return prices.at(-1) ?? null;

    }

    previousPrice() {

        const prices = this.prices();

        return prices.at(-2) ?? null;

    }

    /* -------------------------------------------------------------------------
     * Metadata
     * ---------------------------------------------------------------------- */

    symbol() {

        return this._symbol;

    }

    timeframe() {

        return this._timeframe;

    }

    timestamp() {

        return this._timestamp;

    }

    /* -------------------------------------------------------------------------
     * Options
     * ---------------------------------------------------------------------- */

    options() {

        return this._options;

    }

    hasOption(name) {

        return Object.hasOwn(this._options, name);

    }

    option(name, defaultValue = null) {

        return this._options[name] ?? defaultValue;

    }

    number(name, defaultValue = 0) {

        const value = this.option(name, defaultValue);

        if (typeof value !== "number") {

            throw new TypeError(

                `Option "${name}" must be a number.`

            );

        }

        return value;

    }

    integer(name, defaultValue = 0) {

        const value = this.number(name, defaultValue);

        if (!Number.isInteger(value)) {

            throw new TypeError(

                `Option "${name}" must be an integer.`

            );

        }

        return value;

    }

    string(name, defaultValue = "") {

        const value = this.option(name, defaultValue);

        if (typeof value !== "string") {

            throw new TypeError(

                `Option "${name}" must be a string.`

            );

        }

        return value;

    }

    boolean(name, defaultValue = false) {

        const value = this.option(name, defaultValue);

        if (typeof value !== "boolean") {

            throw new TypeError(

                `Option "${name}" must be a boolean.`

            );

        }

        return value;

    }

    /* -------------------------------------------------------------------------
     * Serialization
     * ---------------------------------------------------------------------- */

    toJSON() {

        return {

            symbol: this._symbol,

            timeframe: this._timeframe,

            source: this._source,

            timestamp: this._timestamp,

            candles: this._candles,

            options: this._options

        };

    }

}