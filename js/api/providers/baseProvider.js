/**
 * ============================================================================
 * Signal Terminal Pro
 * Base Market Data Provider
 * ============================================================================
 *
 * Abstract base class for every market data provider.
 *
 * Supported Providers:
 * - Massive
 * - Polygon
 * - Binance
 * - TwelveData
 * - AlphaVantage
 *
 * Every provider MUST extend this class.
 * ============================================================================
 */

export class BaseProvider {

    constructor(name) {

        if (new.target === BaseProvider) {
            throw new TypeError(
                "BaseProvider is an abstract class and cannot be instantiated directly."
            );
        }

        this.name = name;

        this.connected = false;

        this.stats = {
            requests: 0,
            successful: 0,
            failed: 0,
            startedAt: Date.now()
        };

    }

    /**
     * Provider name.
     *
     * @returns {string}
     */
    getName() {

        return this.name;

    }

    /**
     * Connection state.
     *
     * @returns {boolean}
     */
    isConnected() {

        return this.connected;

    }

    /**
     * Set connection state.
     *
     * @param {boolean} state
     */
    setConnected(state) {

        this.connected = Boolean(state);

    }

    /**
     * Record successful request.
     */
    recordSuccess() {

        this.stats.requests++;
        this.stats.successful++;

    }

    /**
     * Record failed request.
     */
    recordFailure() {

        this.stats.requests++;
        this.stats.failed++;

    }

    /**
     * Statistics.
     *
     * @returns {Object}
     */
    getStats() {

        return Object.freeze({

            ...this.stats,

            connected: this.connected,

            uptime:
                Date.now() - this.stats.startedAt

        });

    }

    /**
     * Validate provider options.
     *
     * @param {Object} options
     */
    validateOptions(options) {

        if (!options || typeof options !== "object") {
            throw new TypeError(
                "Options must be an object."
            );
        }

    }

    /**
     * Validate trading symbol.
     *
     * @param {string} symbol
     */
    validateSymbol(symbol) {

        if (
            typeof symbol !== "string" ||
            symbol.trim() === ""
        ) {
            throw new TypeError(
                "Invalid trading symbol."
            );
        }

    }

    /**
     * Validate timeframe.
     *
     * @param {string} timeframe
     */
    validateTimeframe(timeframe) {

        if (
            typeof timeframe !== "string" ||
            timeframe.trim() === ""
        ) {
            throw new TypeError(
                "Invalid timeframe."
            );
        }

    }

    /**
     * =========================================================================
     * Abstract Methods
     * =========================================================================
     */

    async getCandles() {

        throw new Error(
            `${this.constructor.name} must implement getCandles().`
        );

    }

    async getLatestPrice() {

        throw new Error(
            `${this.constructor.name} must implement getLatestPrice().`
        );

    }

    async getPreviousClose() {

        throw new Error(
            `${this.constructor.name} must implement getPreviousClose().`
        );

    }

    async getMarketStatus() {

        throw new Error(
            `${this.constructor.name} must implement getMarketStatus().`
        );

    }

    async getSupportedSymbols() {

        throw new Error(
            `${this.constructor.name} must implement getSupportedSymbols().`
        );

    }

}