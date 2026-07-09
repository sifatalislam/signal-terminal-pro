/**
 * ============================================================================
 * Signal Terminal Pro
 * Massive Provider Errors
 * ============================================================================
 */

/**
 * Base provider error.
 */
export class MassiveError extends Error {

    constructor(message) {
        super(message);

        this.name = this.constructor.name;

        Error.captureStackTrace?.(
            this,
            this.constructor
        );
    }

}

/**
 * Network connection failed.
 */
export class MassiveNetworkError extends MassiveError {

    constructor(message = "Network request failed.") {
        super(message);
    }

}

/**
 * HTTP status error.
 */
export class MassiveHttpError extends MassiveError {

    constructor(status, statusText) {

        super(`HTTP ${status} ${statusText}`);

        this.status = status;

        this.statusText = statusText;

    }

}

/**
 * Request timeout.
 */
export class MassiveTimeoutError extends MassiveError {

    constructor(timeout) {

        super(`Request timed out after ${timeout} ms.`);

        this.timeout = timeout;

    }

}

/**
 * Invalid API response.
 */
export class MassiveValidationError extends MassiveError {

    constructor(message) {
        super(message);
    }

}

/**
 * Rate limit reached.
 */
export class MassiveRateLimitError extends MassiveError {

    constructor() {

        super("Massive API rate limit exceeded.");

    }

}

/**
 * Authentication failed.
 */
export class MassiveAuthenticationError extends MassiveError {

    constructor() {

        super("Massive API authentication failed.");

    }

}

/**
 * Symbol not supported.
 */
export class MassiveSymbolError extends MassiveError {

    constructor(symbol) {

        super(`Unsupported symbol: ${symbol}`);

        this.symbol = symbol;

    }

}