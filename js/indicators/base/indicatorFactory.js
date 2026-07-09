/**
 * ============================================================================
 * Signal Terminal Pro
 * Indicator Factory
 * ============================================================================
 */

import { indicatorRegistry } from "./indicatorRegistry.js";

export class IndicatorFactory {

    constructor() {

        this.instances = new Map();

    }

    /**
     * Build a deterministic cache key.
     *
     * @param {string} id
     * @param {Object} settings
     * @returns {string}
     */
    createKey(id, settings = {}) {

        const sorted = Object
            .keys(settings)
            .sort()
            .reduce((result, key) => {

                result[key] = settings[key];

                return result;

            }, {});

        return `${id}:${JSON.stringify(sorted)}`;

    }

    /**
     * Return a configured indicator instance.
     *
     * @param {string} id
     * @param {Object} settings
     * @returns {BaseIndicator}
     */
    get(id, settings = {}) {

        const key = this.createKey(id, settings);

        if (this.instances.has(key)) {

            return this.instances.get(key);

        }

        const indicator =
            indicatorRegistry.create(id, settings);

        this.instances.set(key, indicator);

        return indicator;

    }

    /**
     * Remove one cached indicator.
     */
    remove(id, settings = {}) {

        this.instances.delete(

            this.createKey(id, settings)

        );

    }

    /**
     * Remove everything.
     */
    clear() {

        this.instances.clear();

    }

    /**
     * Number of cached indicators.
     */
    size() {

        return this.instances.size;

    }

}

export const indicatorFactory =
    new IndicatorFactory();