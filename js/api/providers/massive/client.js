/**
 * ============================================================================
 * Signal Terminal Pro
 * Massive Provider Client
 * ============================================================================
 */

import { APP_CONFIG } from "../../../config.js";

import { requestManager } from "../../requestManager.js";
import { pipeline } from "../../pipeline.js";

import { MassiveRequest } from "./request.js";
import { MassiveEndpoints } from "./endpoints.js";
import { MassiveMapper } from "./mapper.js";

// Pipeline processors
import { normalize } from "../../processors/normalize.js";
import { validate } from "../../processors/validate.js";
import { deduplicate } from "../../processors/deduplicate.js";
import { sort } from "../../processors/sort.js";
import { freeze } from "../../processors/freeze.js";

export class MassiveClient {

    constructor() {

        this.request = new MassiveRequest();

        this.endpoints = new MassiveEndpoints();

        this.mapper = new MassiveMapper();

        this.pipelineInitialized = false;

    }

    /**
     * Configure processing pipeline.
     */
    initialize() {

        if (this.pipelineInitialized) {
            return;
        }

        pipeline
            .use(normalize)
            .use(validate)
            .use(deduplicate)
            .use(sort)
            .use(freeze);

        this.pipelineInitialized = true;

    }

    /**
     * Retrieve historical candles.
     */
    async getCandles(options) {

        this.initialize();

        const {

            symbol,
            timeframe,
            from,
            to,
            limit = APP_CONFIG.candles.historyLimit

        } = options;

        const url = this.endpoints.candles({

            symbol,
            timeframe,
            from,
            to,
            limit

        });

        const cacheKey =
            `candles:${symbol}:${timeframe}:${from}:${to}:${limit}`;

        return requestManager.execute(

            cacheKey,

            async () => {

                const response =
                    await this.request.get(url);

                return this.mapper.mapCandles(response);

            },

            APP_CONFIG.cache.ttl

        );

    }

    /**
     * Previous close.
     */
    async getPreviousClose(symbol) {

        const url =
            this.endpoints.previousClose(symbol);

        return this.request.get(url);

    }

    /**
     * Market status.
     */
    async getMarketStatus() {

        const url =
            this.endpoints.marketStatus();

        return this.request.get(url);

    }

    /**
     * Provider statistics.
     */
    getStats() {

        return {

            request: this.request.getStats(),

            requestManager: requestManager.getStats()

        };

    }

}