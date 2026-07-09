import { BaseProvider } from "../baseProvider.js";
import { MassiveClient } from "./client.js";

export class MassiveProvider extends BaseProvider {

    constructor() {

        super("Massive");

        this.client = new MassiveClient();

    }

    async getCandles(options) {

        this.validateOptions(options);

        try {

            const candles =
                await this.client.getCandles(options);

            this.recordSuccess();

            this.setConnected(true);

            return candles;

        }
        catch (error) {

            this.recordFailure();

            this.setConnected(false);

            throw error;

        }

    }

    async getPreviousClose(symbol) {

        this.validateSymbol(symbol);

        return this.client.getPreviousClose(symbol);

    }

    async getMarketStatus() {

        return this.client.getMarketStatus();

    }

    async getLatestPrice() {

        throw new Error(
            "MassiveProvider.getLatestPrice() is not implemented."
        );

    }

    async getSupportedSymbols() {

        throw new Error(
            "MassiveProvider.getSupportedSymbols() is not implemented."
        );

    }

}