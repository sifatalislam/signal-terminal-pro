/**
 * ============================================================================
 * Signal Terminal Pro
 * Indicator Point
 * Version: 2.0.0
 * ============================================================================
 *
 * Immutable representation of one calculated indicator value.
 *
 * Examples
 * --------
 * EMA
 *   value = 3421.15
 *
 * RSI
 *   value = 68.42
 *
 * MACD
 *   values = {
 *      macd,
 *      signal,
 *      histogram
 *   }
 *
 * Bollinger Bands
 *   values = {
 *      upper,
 *      middle,
 *      lower
 *   }
 * ============================================================================
 */

export class IndicatorPoint {

    constructor({

        timestamp,

        value = null,

        values = null,

        metadata = {}

    }) {

        if (!Number.isFinite(timestamp)) {

            throw new TypeError(
                "IndicatorPoint requires a valid timestamp."
            );

        }

        if (value !== null && !Number.isFinite(value)) {

            throw new TypeError(
                "IndicatorPoint value must be numeric or null."
            );

        }

        if (
            values !== null &&
            typeof values !== "object"
        ) {

            throw new TypeError(
                "IndicatorPoint values must be an object or null."
            );

        }

        this._timestamp = timestamp;

        this._value = value;

        this._values = values
            ? Object.freeze({ ...values })
            : null;

        this._metadata = Object.freeze({
            ...metadata
        });

        Object.freeze(this);

    }

    /* -------------------------------------------------------------------------
     * Timestamp
     * ---------------------------------------------------------------------- */

    timestamp() {

        return this._timestamp;

    }

    /* -------------------------------------------------------------------------
     * Primary Value
     * ---------------------------------------------------------------------- */

    value() {

        return this._value;

    }

    hasValue() {

        return this._value !== null;

    }

    /* -------------------------------------------------------------------------
     * Multi-value Indicators
     * ---------------------------------------------------------------------- */

    values() {

        return this._values;

    }

    hasValues() {

        return this._values !== null;

    }

    get(name, defaultValue = null) {

        if (!this._values) {

            return defaultValue;

        }

        return this._values[name] ?? defaultValue;

    }

    /* -------------------------------------------------------------------------
     * Metadata
     * ---------------------------------------------------------------------- */

    metadata() {

        return this._metadata;

    }

    meta(name, defaultValue = null) {

        return this._metadata[name] ?? defaultValue;

    }

    /* -------------------------------------------------------------------------
     * Serialization
     * ---------------------------------------------------------------------- */

    toJSON() {

        return {

            timestamp: this._timestamp,

            value: this._value,

            values: this._values,

            metadata: this._metadata

        };

    }

}