/**
 * ============================================================================
 * Signal Terminal Pro
 * Base Indicator
 * Version: 2.0.0
 * ============================================================================
 *
 * Abstract base class for every technical indicator.
 *
 * Responsibilities
 * ----------------
 * • Indicator lifecycle
 * • Runtime management
 * • Validation
 * • Price extraction
 * • Incremental support
 * • Statistics
 * ============================================================================
 */

import { PriceExtractor, PriceSource } from "../utils/priceSource.js";

export class BaseIndicator {

    /**
     * Override in subclasses.
     */
    static definition = Object.freeze({

        id: "base",

        name: "Base Indicator",

        category: "General",

        version: "2.0.0",

        description: "",

        minCandles: 1,

        supports: Object.values(PriceSource),

        defaults: {}

    });

    constructor(settings = {}) {

        if (new.target === BaseIndicator) {

            throw new TypeError(
                "BaseIndicator is abstract and cannot be instantiated."
            );

        }

        this.settings = Object.freeze({

            ...this.constructor.definition.defaults,

            ...settings

        });

        this.runtime = {};

        this.initialize();

    }

    /* -------------------------------------------------------------------------
     * Lifecycle
     * ---------------------------------------------------------------------- */

    initialize() {

     this.runtime = {

        initialized: false,

        calculationCount: 0,

        updateCount: 0,

        errorCount: 0,

        lastExecutionTime: 0,

        totalExecutionTime: 0,

        averageExecutionTime: 0,

        lastTimestamp: null,

        startedAt: Date.now(),

        state: {}

    }

    }

    reset() {

        this.initialize();

    }

    dispose() {

        this.runtime = null;

    }

    /* -------------------------------------------------------------------------
     * Metadata
     * ---------------------------------------------------------------------- */

    getDefinition() {

        return this.constructor.definition;

    }

    getId() {

        return this.constructor.definition.id;

    }

    getName() {

        return this.constructor.definition.name;

    }

    getCategory() {

        return this.constructor.definition.category;

    }

    getVersion() {

        return this.constructor.definition.version;

    }

    getDescription() {

        return this.constructor.definition.description;

    }

    getSettings() {

        return this.settings;

    }

    getMinimumCandles() {

        return this.constructor.definition.minCandles;

    }

    /* -------------------------------------------------------------------------
     * Validation
     * ---------------------------------------------------------------------- */

    validateCandles(candles) {

        if (!Array.isArray(candles)) {

            throw new TypeError(
                `${this.getName()}: candles must be an array.`
            );

        }

        if (candles.length < this.getMinimumCandles()) {

            throw new Error(

                `${this.getName()} requires at least ${this.getMinimumCandles()} candles.`

            );

        }

    }

    validateSource(source) {

        if (!this.constructor.definition.supports.includes(source)) {

            throw new Error(

                `${this.getName()} does not support "${source}".`

            );

        }

    }

    validatePeriod(period) {

        if (

            !Number.isInteger(period)

            ||

            period <= 0

        ) {

            throw new TypeError(

                `${this.getName()}: invalid period.`

            );

        }

    }

    /* -------------------------------------------------------------------------
     * Helpers
     * ---------------------------------------------------------------------- */

    prices(candles, source = PriceSource.CLOSE) {

        return PriceExtractor.series(

            candles,

            source

        );

    }

    price(candle, source = PriceSource.CLOSE) {

        return PriceExtractor.value(

            candle,

            source

        );

    }

    round(value, precision = 6) {

        return Number(

            value.toFixed(precision)

        );

    }

    option(name, defaultValue = null) {

        return this.settings[name] ?? defaultValue;

    }

    /* -------------------------------------------------------------------------
     * Runtime
     * ---------------------------------------------------------------------- */

    state() {

        return this.runtime.state;

    }

    statistics() {

        return Object.freeze({

            calculations:

                this.runtime.calculationCount,

            updates:

                this.runtime.updateCount,

            errors:

                this.runtime.errorCount,

            lastTimestamp:

                this.runtime.lastTimestamp,

            uptime:

                Date.now() -

                this.runtime.startedAt

        });

    }

    /* -------------------------------------------------------------------------
     * Incremental Support
     * ---------------------------------------------------------------------- */

    supportsIncremental() {

        return false;

    }

    /* -------------------------------------------------------------------------
     * Abstract Methods
     * ---------------------------------------------------------------------- */

    calculate() {

        throw new Error(

            `${this.getName()} must implement calculate().`

        );

    }

    update() {

        throw new Error(

            `${this.getName()} does not support incremental updates.`

        );

    }

}