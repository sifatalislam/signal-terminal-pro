/**
 * ============================================================================
 * Signal Terminal Pro
 * Market Service
 * ============================================================================
 *
 * Central orchestration service for all market data.
 *
 * Responsibilities
 * ----------------
 * - Historical data loading
 * - Refresh latest market
 * - Symbol switching
 * - Timeframe switching
 * - State synchronization
 * - Event publishing
 * - Scheduler integration
 * ============================================================================
 */

import { APP_CONFIG } from "../config.js";

import { state } from "../core/state.js";
import { logger } from "../core/logger.js";
import { scheduler } from "../core/scheduler.js";
import { eventBus } from "../core/eventBus.js";

import { EVENTS, TASKS } from "../utils/constants.js";

import { MassiveProvider } from "../api/providers/massive/index.js";

export class MarketService {

    constructor(provider = new MassiveProvider()) {

        this.provider = provider;

        this.loading = false;

        this.started = false;

    }

    /**
     * ------------------------------------------------------------------------
     * Start Market Service
     * ------------------------------------------------------------------------
     */
    start() {

        if (this.started) {
            return;
        }

        this.started = true;

        scheduler.add(

            TASKS.MARKET_UPDATE,

            async () => {

                await this.refresh();

            },

            APP_CONFIG.scheduler.marketUpdate

        );

        logger.info("Market Service started.");

    }

    /**
     * ------------------------------------------------------------------------
     * Stop Market Service
     * ------------------------------------------------------------------------
     */
    stop() {

        scheduler.stop(TASKS.MARKET_UPDATE);

        this.started = false;

        logger.info("Market Service stopped.");

    }

    /**
     * ------------------------------------------------------------------------
     * Refresh Current Market
     * ------------------------------------------------------------------------
     */
    async refresh() {

        if (this.loading) {
            return;
        }

        await this.loadHistory();

    }

    /**
     * ------------------------------------------------------------------------
     * Load Historical Candles
     * ------------------------------------------------------------------------
     */
    async loadHistory() {

        if (this.loading) {
            return state.get("candles");
        }

        this.loading = true;

        state.set("loading", true);

        eventBus.emit(EVENTS.LOADING_STARTED);

        try {

            const symbol =
                state.get("symbol");

            const timeframe =
                state.get("timeframe");

            const range =
                this.calculateRange(timeframe);

            const candles =
                await this.provider.getCandles({

                    symbol,

                    timeframe,

                    from: range.from,

                    to: range.to,

                    limit: APP_CONFIG.candles.historyLimit

                });

            state.update({

                candles,

                loading: false

            });

            eventBus.emit(

                EVENTS.CANDLES_UPDATED,

                candles

            );

            logger.info(

                `Loaded ${candles.length} candles (${symbol} ${timeframe})`

            );

            return candles;

        }
        catch (error) {

            logger.error(

                "Failed to load market history.",

                error

            );

            eventBus.emit(

                EVENTS.ERROR,

                error

            );

            throw error;

        }
        finally {

            this.loading = false;

            state.set("loading", false);

            eventBus.emit(

                EVENTS.LOADING_FINISHED

            );

        }

    }

    /**
     * ------------------------------------------------------------------------
     * Change Symbol
     * ------------------------------------------------------------------------
     */
    async setSymbol(symbol) {

        if (symbol === state.get("symbol")) {
            return;
        }

        state.set("symbol", symbol);

        eventBus.emit(

            EVENTS.SYMBOL_CHANGED,

            symbol

        );

        return this.loadHistory();

    }

    /**
     * ------------------------------------------------------------------------
     * Change Timeframe
     * ------------------------------------------------------------------------
     */
    async setTimeframe(timeframe) {

        if (timeframe === state.get("timeframe")) {
            return;
        }

        state.set("timeframe", timeframe);

        eventBus.emit(

            EVENTS.TIMEFRAME_CHANGED,

            timeframe

        );

        return this.loadHistory();

    }

    /**
     * ------------------------------------------------------------------------
     * Previous Close
     * ------------------------------------------------------------------------
     */
    async previousClose() {

        return this.provider.getPreviousClose(

            state.get("symbol")

        );

    }

    /**
     * ------------------------------------------------------------------------
     * Market Status
     * ------------------------------------------------------------------------
     */
    async marketStatus() {

        return this.provider.getMarketStatus();

    }

    /**
     * ------------------------------------------------------------------------
     * Current Provider Statistics
     * ------------------------------------------------------------------------
     */
    statistics() {

        return this.provider.getStats();

    }

    /**
     * ------------------------------------------------------------------------
     * Calculate History Range
     * ------------------------------------------------------------------------
     */
    calculateRange(timeframe) {

        const to = new Date();

        const from = new Date();

        const lookback = {

            "1m": 10,
            "2m": 20,
            "3m": 30,
            "5m": 45,
            "10m": 90,
            "15m": 120,
            "30m": 180,
            "1h": 365,
            "4h": 730,
            "1d": 3650

        };

        from.setDate(

            from.getDate() -

            (lookback[timeframe] ?? 30)

        );

        return {

            from:

                from.toISOString().substring(0, 10),

            to:

                to.toISOString().substring(0, 10)

        };

    }

}