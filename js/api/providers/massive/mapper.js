/**
 * ============================================================================
 * Signal Terminal Pro
 * Massive Response Mapper
 * ============================================================================
 */

import { pipeline } from "../../pipeline.js";
import { MassiveValidationError } from "./errors.js";

export class MassiveMapper {

    constructor() {

        this.initialized = false;

    }

    /**
     * Register pipeline processors.
     *
     * @param {Function[]} processors
     */
    initialize(processors = []) {

        if (this.initialized) {
            return;
        }

        for (const processor of processors) {
            pipeline.use(processor);
        }

        this.initialized = true;

    }

    /**
     * Convert Massive aggregate response into
     * internal immutable candle objects.
     *
     * @param {Object} response
     * @returns {Array}
     */
    mapCandles(response) {

        if (!response || typeof response !== "object") {

            throw new MassiveValidationError(
                "Invalid Massive response."
            );

        }

        if (!Array.isArray(response.results)) {

            throw new MassiveValidationError(
                "Response does not contain a valid 'results' array."
            );

        }

        return pipeline.process(response.results);

    }

    /**
     * Extract pagination/meta information.
     *
     * Useful for future endpoints.
     */
    metadata(response) {

        return {

            ticker: response.ticker ?? null,

            adjusted: response.adjusted ?? null,

            queryCount: response.queryCount ?? 0,

            resultsCount: response.resultsCount ?? 0,

            requestId: response.request_id ?? null,

            status: response.status ?? null

        };

    }

}