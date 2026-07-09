/**
 * ============================================================================
 * Signal Terminal Pro
 * Global Application State
 * ============================================================================
 */

import { eventBus } from "./eventBus.js";
import { EVENTS } from "../utils/constants.js";

class State {

    constructor() {

        this.store = {

            symbol: null,

            timeframe: null,

            candles: [],

            indicators: {},

            trend: null,

            volatility: null,

            marketStructure: null,

            confidence: 0,

            signal: null,

            statistics: {},

            session: {},

            loading: false

        };

    }

    /**
     * Returns a value.
     *
     * @param {string} key
     * @returns {*}
     */
    get(key) {

        return this.store[key];

    }

    /**
     * Returns a deep copy of the entire state.
     */
    getAll() {

        return structuredClone(this.store);

    }

    /**
     * Set one value.
     *
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {

        if (!(key in this.store)) {
            throw new Error(`Unknown state key: ${key}`);
        }

        this.store[key] = value;

        eventBus.emit(EVENTS.STATE_CHANGED, {
            key,
            value
        });

    }

    /**
     * Update multiple values.
     *
     * @param {Object} values
     */
    update(values) {

        const changed = {};

        for (const [key, value] of Object.entries(values)) {

            if (!(key in this.store)) {
                continue;
            }

            this.store[key] = value;
            changed[key] = value;

        }

        eventBus.emit(EVENTS.STATE_UPDATED, changed);

    }

    /**
     * Reset application state.
     */
    reset() {

        this.store = {

            symbol: null,

            timeframe: null,

            candles: [],

            indicators: {},

            trend: null,

            volatility: null,

            marketStructure: null,

            confidence: 0,

            signal: null,

            statistics: {},

            session: {},

            loading: false

        };

        eventBus.emit(EVENTS.STATE_RESET);

    }

}

export const state = new State();