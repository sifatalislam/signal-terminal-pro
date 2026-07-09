/**
 * ============================================================================
 * Signal Terminal Pro
 * Global Configuration
 * ============================================================================
 * This file contains every configurable value used by the application.
 * No module should hardcode these values.
 * ============================================================================
 */

export const APP_CONFIG = Object.freeze({

    app: {
        name: "Signal Terminal Pro",
        version: "1.0.0",
        environment: "development",
        debug: true
    },

    api: {
        provider: "Massive",
        baseUrl: "https://api.massive.com",
        apiKey: "",
        requestTimeout: 10000,
        retryAttempts: 3,
        retryDelay: 1500
    },

    market: {
        defaultSymbol: "XAUUSD",

        supportedSymbols: [
            "XAUUSD",
            "EURUSD",
            "GBPUSD",
            "USDJPY",
            "BTCUSD",
            "ETHUSD"
        ]
    },

    timeframe: {

        default: "1m",

        supported: [
            "1m",
            "2m",
            "3m",
            "5m",
            "10m",
            "15m",
            "30m",
            "1h",
            "4h",
            "1d"
        ]
    },

    candles: {

        historyLimit: 5000,

        realtimeRefresh: 1000,

        cacheLifetime: 30000
    },

    indicators: {

        sma: {
            period: 20
        },

        ema: {
            fast: 20,
            slow: 50
        },

        rsi: {
            period: 14,
            overbought: 70,
            oversold: 30
        },

        macd: {
            fast: 12,
            slow: 26,
            signal: 9
        },

        adx: {
            period: 14,
            strongTrend: 25
        },

        atr: {
            period: 14
        },

        bollinger: {
            period: 20,
            deviation: 2
        },

        stochastic: {
            k: 14,
            d: 3,
            smooth: 3
        },

        vwap: {},

        supertrend: {
            atrPeriod: 10,
            multiplier: 3
        },

        supportResistance: {
            lookback: 50
        }

    },

    signal: {

        minimumConfidence: 65,

        weights: {

            trend: 0.30,

            momentum: 0.20,

            volatility: 0.15,

            volume: 0.10,

            supportResistance: 0.15,

            multiTimeframe: 0.10

        }

    },

    cache: {

        enabled: true,

        maxItems: 500,

        ttl: 60000

    },

    scheduler: {

        marketUpdate: 1000,

        indicatorUpdate: 1000,

        signalUpdate: 1000

    },

    chart: {

        timezone: "UTC",

        autoscale: true,

        crosshair: true,

        rightPriceScale: true

    },

    ui: {

        theme: "dark",

        notifications: true,

        animations: true

    }

});