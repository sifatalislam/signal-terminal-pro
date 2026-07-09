/**
 * ============================================================================
 * Signal Terminal Pro
 * Response Normalizer
 * ============================================================================
 */

class ResponseNormalizer {

    /**
     * Normalize Massive aggregate candles.
     *
     * @param {Array} rawCandles
     * @returns {Array}
     */
    normalizeCandles(rawCandles) {

        return rawCandles.map(candle => ({

            timestamp: candle.t,

            open: candle.o,

            high: candle.h,

            low: candle.l,

            close: candle.c,

            volume: candle.v ?? 0

        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    }

}

export const normalizer = new ResponseNormalizer();