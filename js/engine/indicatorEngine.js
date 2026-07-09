/**
 * ============================================================================
 * Signal Terminal Pro
 * Indicator Engine
 * Version: 2.0.0
 * ============================================================================
 *
 * Responsibilities
 * ----------------
 * • Create IndicatorContext
 * • Execute indicators
 * • Batch execution
 * • Incremental updates
 * • Result caching
 * • Runtime statistics
 * ============================================================================
 */

import { IndicatorContext } from "../models/indicatorContext.js";
import { indicatorFactory } from "../indicators/indicatorFactory.js";

export class IndicatorEngine {

    constructor() {

        this.cache = new Map();

        this.runtime = {

            executions: 0,

            updates: 0,

            failures: 0,

            cacheHits: 0,

            totalExecutionTime: 0

        };

    }

    /* -------------------------------------------------------------------------
     * Context
     * ---------------------------------------------------------------------- */

    createContext(config, candles) {

        return new IndicatorContext({

            candles,

            symbol: config.symbol ?? null,

            timeframe: config.timeframe ?? null,

            source: config.settings?.source,

            options: config.settings ?? {}

        });

    }

    /* -------------------------------------------------------------------------
     * Cache
     * ---------------------------------------------------------------------- */

    cacheKey(config) {

        const settings = Object.keys(config.settings ?? {})
            .sort()
            .reduce((obj, key) => {

                obj[key] = config.settings[key];

                return obj;

            }, {});

        return JSON.stringify({

            id: config.id,

            symbol: config.symbol,

            timeframe: config.timeframe,

            settings

        });

    }

    getCached(config) {

        const key = this.cacheKey(config);

        const value = this.cache.get(key);

        if (value) {

            this.runtime.cacheHits++;

        }

        return value ?? null;

    }

    setCached(config, result) {

        this.cache.set(

            this.cacheKey(config),

            result

        );

    }

    clearCache() {

        this.cache.clear();

    }

    /* -------------------------------------------------------------------------
     * Historical Calculation
     * ---------------------------------------------------------------------- */

    calculate(config, candles) {

        const start = performance.now();

        try {

            const indicator = indicatorFactory.get(

                config.id,

                config.settings

            );

            const context = this.createContext(

                config,

                candles

            );

            const result = indicator.calculate(

                context

            );

            this.runtime.executions++;

            this.runtime.totalExecutionTime +=

                performance.now() - start;

            this.setCached(

                config,

                result

            );

            return result;

        }

        catch (error) {

            this.runtime.failures++;

            throw error;

        }

    }

    /* -------------------------------------------------------------------------
     * Incremental Update
     * ---------------------------------------------------------------------- */

    update(config, previousSeries, candle) {

        const indicator = indicatorFactory.get(

            config.id,

            config.settings

        );

        if (

            !indicator.supportsIncremental()

        ) {

            throw new Error(

                `${indicator.getName()} does not support incremental updates.`

            );

        }

        const result = indicator.update(

            previousSeries,

            candle

        );

        this.runtime.updates++;

        this.setCached(

            config,

            result

        );

        return result;

    }

    /* -------------------------------------------------------------------------
     * Smart Execution
     * ---------------------------------------------------------------------- */

    execute(config, candles, previousSeries = null) {

        const indicator = indicatorFactory.get(

            config.id,

            config.settings

        );

        if (

            previousSeries &&

            indicator.supportsIncremental() &&

            candles.length > 0

        ) {

            return this.update(

                config,

                previousSeries,

                candles.at(-1)

            );

        }

        return this.calculate(

            config,

            candles

        );

    }

    /* -------------------------------------------------------------------------
     * Batch Execution
     * ---------------------------------------------------------------------- */

    executeAll(configs, candles) {

        const results = new Map();

        for (const config of configs) {

            results.set(

                config.id,

                this.execute(

                    config,

                    candles

                )

            );

        }

        return results;

    }

    /* -------------------------------------------------------------------------
     * Runtime
     * ---------------------------------------------------------------------- */

    statistics() {

        return Object.freeze({

            executions:

                this.runtime.executions,

            updates:

                this.runtime.updates,

            failures:

                this.runtime.failures,

            cacheHits:

                this.runtime.cacheHits,

            cacheSize:

                this.cache.size,

            averageExecutionTime:

                this.runtime.executions === 0

                    ? 0

                    : this.runtime.totalExecutionTime /

                      this.runtime.executions

        });

    }

    reset() {

        this.clearCache();

        this.runtime = {

            executions: 0,

            updates: 0,

            failures: 0,

            cacheHits: 0,

            totalExecutionTime: 0

        };

    }

}

export const indicatorEngine =
    new IndicatorEngine();