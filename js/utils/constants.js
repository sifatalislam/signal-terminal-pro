/**
 * ============================================================================
 * Signal Terminal Pro
 * Application Constants
 * ============================================================================
 */

export const APP_NAME = "Signal Terminal Pro";
export const APP_VERSION = "1.0.0";

/**
 * Signal types
 */
export const SIGNAL = Object.freeze({
    BUY: "BUY",
    SELL: "SELL",
    WAIT: "WAIT"
});

/**
 * Trend direction
 */
export const TREND = Object.freeze({
    BULLISH: "BULLISH",
    BEARISH: "BEARISH",
    SIDEWAYS: "SIDEWAYS"
});

/**
 * Market condition
 */
export const MARKET_CONDITION = Object.freeze({
    TRENDING: "TRENDING",
    RANGING: "RANGING",
    VOLATILE: "VOLATILE",
    LOW_VOLATILITY: "LOW_VOLATILITY"
});

/**
 * Event Bus events
 */
export const EVENTS = Object.freeze({

    APP_READY: "app:ready",

    MARKET_UPDATED: "market:updated",

    PRICE_UPDATED: "price:updated",

    CANDLES_UPDATED: "candles:updated",

    INDICATORS_UPDATED: "indicators:updated",

    TREND_UPDATED: "trend:updated",

    VOLATILITY_UPDATED: "volatility:updated",

    STRUCTURE_UPDATED: "structure:updated",

    CONFIDENCE_UPDATED: "confidence:updated",

    SIGNAL_UPDATED: "signal:updated",

    SYMBOL_CHANGED: "symbol:changed",

    TIMEFRAME_CHANGED: "timeframe:changed",

    ERROR: "error"
});

/**
 * Logger levels
 */
export const LOG_LEVEL = Object.freeze({
    DEBUG: "DEBUG",
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR"
});

/**
 * Scheduler task names
 */
export const TASKS = Object.freeze({
    MARKET_UPDATE: "market-update",
    INDICATOR_UPDATE: "indicator-update",
    SIGNAL_UPDATE: "signal-update"
});

/**
 * Cache namespaces
 */
export const CACHE_KEYS = Object.freeze({
    CANDLES: "candles",
    INDICATORS: "indicators",
    SIGNAL: "signal"
});