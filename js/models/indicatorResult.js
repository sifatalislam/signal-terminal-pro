/**
 * ============================================================================
 * Signal Terminal Pro
 * Indicator Result Model
 * ============================================================================
 */

export class IndicatorResult {

    constructor({

        name,

        timestamp,

        value,

        values = null,

        signal = null,

        metadata = {}

    }) {

        if (!name) {
            throw new Error("Indicator name is required.");
        }

        if (!Number.isFinite(timestamp)) {
            throw new Error("Invalid timestamp.");
        }

        this.name = name;

        this.timestamp = timestamp;

        this.value = value;

        this.values = values;

        this.signal = signal;

        this.metadata = Object.freeze({
            ...metadata
        });

        Object.freeze(this);

    }

    /**
     * Indicator name.
     */
    getName() {

        return this.name;

    }

    /**
     * Latest value.
     */
    getValue() {

        return this.value;

    }

    /**
     * Multi-value indicators.
     *
     * Example:
     * MACD
     * Bollinger
     * Stochastic
     */
    getValues() {

        return this.values;

    }

    /**
     * Timestamp.
     */
    getTimestamp() {

        return this.timestamp;

    }

    /**
     * Optional signal.
     */
    hasSignal() {

        return this.signal !== null;

    }

    /**
     * JSON serialization.
     */
    toJSON() {

        return {

            name: this.name,

            timestamp: this.timestamp,

            value: this.value,

            values: this.values,

            signal: this.signal,

            metadata: this.metadata

        };

    }

}