/**
 * ============================================================================
 * Signal Terminal Pro
 * Application Entry Point
 * ============================================================================
 */

import { APP_CONFIG } from "./config.js";

import { logger } from "./core/logger.js";
import { state } from "./core/state.js";
import { scheduler } from "./core/scheduler.js";
import { eventBus } from "./core/eventBus.js";

import { EVENTS, TASKS } from "./utils/constants.js";

class Application {

    initialize() {

        logger.group(APP_CONFIG.app.name);

        logger.info("Initializing application...");
        logger.info(`Version: ${APP_CONFIG.app.version}`);
        logger.info(`Environment: ${APP_CONFIG.app.environment}`);

        this.initializeState();

        this.initializeScheduler();

        eventBus.emit(EVENTS.APP_READY);

        logger.info("Application initialized successfully.");

        logger.groupEnd();
    }

    initializeState() {

        state.update({

            symbol: APP_CONFIG.market.defaultSymbol,

            timeframe: APP_CONFIG.timeframe.default,

            candles: [],

            indicators: {},

            signal: null,

            confidence: 0,

            loading: false

        });

    }

    initializeScheduler() {

        scheduler.add(

            TASKS.MARKET_UPDATE,

            () => {

                logger.debug("Market update tick");

            },

            APP_CONFIG.scheduler.marketUpdate

        );

    }

}

const app = new Application();

app.initialize();

export default app;