/*
==========================================================
Signal Terminal Pro
Global Configuration
==========================================================
*/

const CONFIG = {

    APP: {

        NAME: "Signal Terminal Pro",

        VERSION: "1.0.0",

        AUTO_REFRESH: true,

        REFRESH_INTERVAL: 5000,

        MAX_BARS: 500,

        MAX_HISTORY: 200

    },

    API: {

        BASE_URL: "https://api.massive.com",

        AGG_ENDPOINT: "/v2/aggs/ticker",

        QUOTE_ENDPOINT: "/v3/quotes",

        LAST_TRADE_ENDPOINT: "/v2/last/trade",

        CACHE_SECONDS: 2

    },

    MARKET: {

        DEFAULT_SYMBOL: "C:EURUSD",

        DEFAULT_TIMEFRAME: {

            multiplier: 1,

            timespan: "minute"

        }

    },

    INDICATORS: {

        EMA_FAST: 9,

        EMA_SLOW: 21,

        EMA_50: 50,

        EMA_200: 200,

        RSI: 14,

        MACD_FAST: 12,

        MACD_SLOW: 26,

        MACD_SIGNAL: 9,

        STOCHASTIC: 14,

        STOCHASTIC_SMOOTH: 3,

        ADX: 14,

        ATR: 14,

        BOLLINGER: {

            PERIOD: 20,

            STD_DEV: 2

        },

        SUPERTREND: {

            ATR: 10,

            MULTIPLIER: 3

        }

    },

    CONFIDENCE: {

        EMA: 2,

        MACD: 2,

        RSI: 1,

        ADX: 1.5,

        STOCHASTIC: 1,

        BOLLINGER: 1,

        ATR: 1,

        SUPERTREND: 3,

        VWAP: 2,

        SUPPORT: 2

    },

    UI: {

        PRICE_DECIMALS: 5,

        REFRESH_ANIMATION: true,

        SHOW_WATERMARK: true,

        SHOW_VOLUME: true,

        SHOW_CROSSHAIR: true,

        SHOW_MARKERS: true

    }

};

export default CONFIG;