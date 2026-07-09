/**
 * ============================================================================
 * Signal Terminal Pro
 * Indicator Registry
 * ============================================================================
 */

export class IndicatorRegistry {

    constructor() {

        this.registry = new Map();

    }

    /**
     * Register an indicator class.
     *
     * @param {typeof BaseIndicator} IndicatorClass
     */
    register(IndicatorClass) {

        if (typeof IndicatorClass !== "function") {
            throw new TypeError(
                "Indicator must be a class."
            );
        }

        const definition = IndicatorClass.definition;

        if (!definition) {
            throw new Error(
                `${IndicatorClass.name} is missing static definition.`
            );
        }

        if (!definition.id) {
            throw new Error(
                `${IndicatorClass.name} definition is missing id.`
            );
        }

        const id = definition.id.toLowerCase();

        if (this.registry.has(id)) {

            throw new Error(
                `Indicator "${id}" is already registered.`
            );

        }

        this.registry.set(id, IndicatorClass);

    }

    /**
     * Remove indicator.
     *
     * @param {string} id
     */
    unregister(id) {

        this.registry.delete(id.toLowerCase());

    }

    /**
     * Check registration.
     *
     * @param {string} id
     */
    has(id) {

        return this.registry.has(id.toLowerCase());

    }

    /**
     * Create indicator instance.
     *
     * @param {string} id
     * @param {Object} settings
     */
    create(id, settings = {}) {

        const IndicatorClass =
            this.registry.get(id.toLowerCase());

        if (!IndicatorClass) {

            throw new Error(
                `Indicator "${id}" is not registered.`
            );

        }

        return new IndicatorClass(settings);

    }

    /**
     * Get indicator class.
     *
     * @param {string} id
     */
    get(id) {

        return this.registry.get(id.toLowerCase()) ?? null;

    }

    /**
     * Return metadata only.
     */
    definitions() {

        return [...this.registry.values()]
            .map(indicator => indicator.definition);

    }

    /**
     * Return all indicator ids.
     */
    ids() {

        return [...this.registry.keys()];

    }

    /**
     * Return all registered classes.
     */
    classes() {

        return [...this.registry.values()];

    }

    /**
     * Number of indicators.
     */
    size() {

        return this.registry.size;

    }

    /**
     * Remove everything.
     */
    clear() {

        this.registry.clear();

    }

}

export const indicatorRegistry =
    new IndicatorRegistry();