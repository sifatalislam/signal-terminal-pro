/**
 * ============================================================================
 * Signal Terminal Pro
 * Data Processing Pipeline
 * ============================================================================
 */

import { logger } from "../core/logger.js";

class Pipeline {

    constructor() {
        this.steps = [];
    }

    /**
     * Register a processing step.
     *
     * @param {Function} processor
     */
    use(processor) {

        if (typeof processor !== "function") {
            throw new TypeError("Pipeline processor must be a function.");
        }

        this.steps.push(processor);

        return this;
    }

    /**
     * Process data through every registered step.
     *
     * @param {*} data
     * @returns {*}
     */
    process(data) {

        let result = data;

        for (const processor of this.steps) {

            try {

                result = processor(result);

            } catch (error) {

                logger.error(
                    `Pipeline step failed: ${processor.name}`,
                    error
                );

                throw error;

            }

        }

        return result;

    }

    /**
     * Remove every registered step.
     */
    clear() {
        this.steps = [];
    }

    /**
     * Number of registered steps.
     */
    count() {
        return this.steps.length;
    }

}

export const pipeline = new Pipeline();