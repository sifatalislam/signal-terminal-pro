/**
 * ============================================================================
 * Signal Terminal Pro
 * Candle Model
 * ============================================================================
 */

export class Candle {

    constructor({
        timestamp,
        open,
        high,
        low,
        close,
        volume = 0
    }) {

        this.timestamp = Number(timestamp);

        this.open = Number(open);

        this.high = Number(high);

        this.low = Number(low);

        this.close = Number(close);

        this.volume = Number(volume);

        this.validate();

        Object.freeze(this);

    }

    /**
     * ------------------------------------------------------------------------
     * Validation
     * ------------------------------------------------------------------------
     */

    validate() {

        if (!Number.isFinite(this.timestamp))
            throw new Error("Invalid candle timestamp.");

        if (
            !Number.isFinite(this.open) ||
            !Number.isFinite(this.high) ||
            !Number.isFinite(this.low) ||
            !Number.isFinite(this.close)
        ) {
            throw new Error("Invalid OHLC values.");
        }

        if (this.high < this.low)
            throw new Error("High cannot be lower than Low.");

        if (this.high < this.open || this.high < this.close)
            throw new Error("High price is invalid.");

        if (this.low > this.open || this.low > this.close)
            throw new Error("Low price is invalid.");
    }

    /**
     * ------------------------------------------------------------------------
     * Candle Direction
     * ------------------------------------------------------------------------
     */

    isBullish() {

        return this.close > this.open;

    }

    isBearish() {

        return this.close < this.open;

    }

    isNeutral() {

        return this.close === this.open;

    }

    /**
     * ------------------------------------------------------------------------
     * Candle Body
     * ------------------------------------------------------------------------
     */

    bodySize() {

        return Math.abs(this.close - this.open);

    }

    /**
     * ------------------------------------------------------------------------
     * Candle Range
     * ------------------------------------------------------------------------
     */

    range() {

        return this.high - this.low;

    }

    /**
     * ------------------------------------------------------------------------
     * Upper Wick
     * ------------------------------------------------------------------------
     */

    upperWick() {

        return this.high - Math.max(this.open, this.close);

    }

    /**
     * ------------------------------------------------------------------------
     * Lower Wick
     * ------------------------------------------------------------------------
     */

    lowerWick() {

        return Math.min(this.open, this.close) - this.low;

    }

    /**
     * ------------------------------------------------------------------------
     * Mid Price
     * ------------------------------------------------------------------------
     */

    midpoint() {

        return (this.high + this.low) / 2;

    }

    /**
     * ------------------------------------------------------------------------
     * Typical Price
     * ------------------------------------------------------------------------
     */

    typicalPrice() {

        return (
            this.high +
            this.low +
            this.close
        ) / 3;

    }

    /**
     * ------------------------------------------------------------------------
     * Weighted Close
     * ------------------------------------------------------------------------
     */

    weightedClose() {

        return (
            this.high +
            this.low +
            (2 * this.close)
        ) / 4;

    }

    /**
     * ------------------------------------------------------------------------
     * HL2
     * ------------------------------------------------------------------------
     */

    hl2() {

        return (
            this.high +
            this.low
        ) / 2;

    }

    /**
     * ------------------------------------------------------------------------
     * HLC3
     * ------------------------------------------------------------------------
     */

    hlc3() {

        return (
            this.high +
            this.low +
            this.close
        ) / 3;

    }

    /**
     * ------------------------------------------------------------------------
     * OHLC4
     * ------------------------------------------------------------------------
     */

    ohlc4() {

        return (
            this.open +
            this.high +
            this.low +
            this.close
        ) / 4;

    }

    /**
     * ------------------------------------------------------------------------
     * Body Percentage
     * ------------------------------------------------------------------------
     */

    bodyPercent() {

        const range = this.range();

        if (range === 0) {
            return 0;
        }

        return (this.bodySize() / range) * 100;

    }

    /**
     * ------------------------------------------------------------------------
     * Doji Detection
     * ------------------------------------------------------------------------
     */

    isDoji(threshold = 10) {

        return this.bodyPercent() <= threshold;

    }

    /**
     * ------------------------------------------------------------------------
     * Shadow Dominance
     * ------------------------------------------------------------------------
     */

    hasLongUpperShadow(multiplier = 2) {

        return (
            this.upperWick() >
            this.bodySize() * multiplier
        );

    }

    hasLongLowerShadow(multiplier = 2) {

        return (
            this.lowerWick() >
            this.bodySize() * multiplier
        );

    }

    /**
     * ------------------------------------------------------------------------
     * Plain Object
     * ------------------------------------------------------------------------
     */

    toJSON() {

        return {

            timestamp: this.timestamp,

            open: this.open,

            high: this.high,

            low: this.low,

            close: this.close,

            volume: this.volume

        };

    }

}