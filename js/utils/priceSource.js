/**
 * ============================================================================
 * Signal Terminal Pro
 * Price Source
 * Version: 2.0.0
 * ============================================================================
 *
 * Centralized price extraction utility.
 *
 * Supported Sources
 * -----------------
 * • OPEN
 * • HIGH
 * • LOW
 * • CLOSE
 * • HL2
 * • HLC3
 * • OHLC4
 * • TYPICAL
 * • WEIGHTED
 * ============================================================================
 */

export const PriceSource = Object.freeze({

    OPEN: "open",

    HIGH: "high",

    LOW: "low",

    CLOSE: "close",

    HL2: "hl2",

    HLC3: "hlc3",

    OHLC4: "ohlc4",

    TYPICAL: "typical",

    WEIGHTED: "weighted"

});

export class PriceExtractor {

    /**
     * -------------------------------------------------------------------------
     * Validation
     * -------------------------------------------------------------------------
     */

    static isValid(source) {

        return Object.values(PriceSource).includes(source);

    }

    /**
     * -------------------------------------------------------------------------
     * Extract one value.
     * -------------------------------------------------------------------------
     */

    static value(candle, source = PriceSource.CLOSE) {

        switch (source) {

            case PriceSource.OPEN:
                return candle.open;

            case PriceSource.HIGH:
                return candle.high;

            case PriceSource.LOW:
                return candle.low;

            case PriceSource.CLOSE:
                return candle.close;

            case PriceSource.HL2:
                return candle.hl2();

            case PriceSource.HLC3:
                return candle.hlc3();

            case PriceSource.OHLC4:
                return candle.ohlc4();

            case PriceSource.TYPICAL:
                return candle.typicalPrice();

            case PriceSource.WEIGHTED:
                return candle.weightedClose();

            default:

                throw new Error(
                    `Unsupported price source "${source}".`
                );

        }

    }

    /**
     * -------------------------------------------------------------------------
     * Extract complete series.
     * -------------------------------------------------------------------------
     */

    static series(candles, source = PriceSource.CLOSE) {

        if (!Array.isArray(candles)) {

            throw new TypeError(
                "Candles must be an array."
            );

        }

        return candles.map(candle =>
            this.value(candle, source)
        );

    }

    /**
     * -------------------------------------------------------------------------
     * Latest value.
     * -------------------------------------------------------------------------
     */

    static latest(candles, source = PriceSource.CLOSE) {

        if (!candles.length) {

            return null;

        }

        return this.value(

            candles.at(-1),

            source

        );

    }

    /**
     * -------------------------------------------------------------------------
     * Previous value.
     * -------------------------------------------------------------------------
     */

    static previous(candles, source = PriceSource.CLOSE) {

        if (candles.length < 2) {

            return null;

        }

        return this.value(

            candles.at(-2),

            source

        );

    }

    /**
     * -------------------------------------------------------------------------
     * Extract values from a range.
     * -------------------------------------------------------------------------
     */

    static range(

        candles,

        start,

        end,

        source = PriceSource.CLOSE

    ) {

        return candles

            .slice(start, end)

            .map(candle =>

                this.value(

                    candle,

                    source

                )

            );

    }

    /**
     * -------------------------------------------------------------------------
     * Average value.
     * -------------------------------------------------------------------------
     */

    static average(

        candles,

        source = PriceSource.CLOSE

    ) {

        if (!candles.length) {

            return null;

        }

        const prices = this.series(

            candles,

            source

        );

        let total = 0;

        for (const price of prices) {

            total += price;

        }

        return total / prices.length;

    }

}