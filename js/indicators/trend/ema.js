/**
 * ============================================================================
 * Signal Terminal Pro
 * Exponential Moving Average (EMA)
 * ============================================================================
 */

import { MovingAverageIndicator } from "./movingAverageIndicator.js";

import { PriceSource } from "../utils/priceSource.js";

import { IndicatorSeries } from "../models/indicatorSeries.js";
import { IndicatorPoint } from "../models/indicatorPoint.js";

export class EMA extends MovingAverageIndicator {

    static definition = {

        id: "ema",

        name: "Exponential Moving Average",

        category: "Trend",

        version: "1.0.0",

        description: "Exponential Moving Average",

        minCandles: 2,

        supports: Object.values(PriceSource),

        defaults: {

            period: 20,

            source: PriceSource.CLOSE

        }

    };

    constructor(settings = {}) {

        super(settings);

        this.state = {

            lastEMA: null,

            multiplier: null,

            initialized: false

        };

    }

    supportsIncremental() {

        return true;

    }

    /**
     * ------------------------------------------------------------------------
     * Historical Calculation
     * ------------------------------------------------------------------------
     */
    calculate(context) {

        const candles = context.getCandles();

        this.validateCandles(candles);

        const period = context.option(

            "period",

            this.settings.period

        );

        this.validatePeriod(period);

        const source = context.getSource();

        this.validateSource(source);

        const prices = this.extractPrices(

            candles,

            source

        );

        if (prices.length < period) {

            throw new Error(

                `${this.getName()} requires at least ${period} candles.`

            );

        }

        const multiplier = this.multiplier(period);

        const points = [];

        let ema = this.seed(

            prices,

            period

        );

        this.state.multiplier = multiplier;

        this.state.lastEMA = ema;

        this.state.initialized = true;

        /*
         * Warmup
         */

        for (let i = 0; i < period - 1; i++) {

            points.push(

                new IndicatorPoint({

                    timestamp:

                        candles[i].timestamp,

                    value: null

                })

            );

        }

        /*
         * First EMA
         */

        points.push(

            new IndicatorPoint({

                timestamp:

                    candles[period - 1].timestamp,

                value: this.round(ema)

            })

        );

        /*
         * Remaining EMA values
         */

        for (

            let i = period;

            i < prices.length;

            i++

        ) {

            ema =

                (prices[i] - ema)

                * multiplier

                + ema;

            points.push(

                new IndicatorPoint({

                    timestamp:

                        candles[i].timestamp,

                    value:

                        this.round(ema)

                })

            );

        }

        this.state.lastEMA = ema;

        return new IndicatorSeries({

            name: this.getName(),

            source,

            settings: {

                period

            },

            points

        });

    }

    /**
     * ------------------------------------------------------------------------
     * Incremental Update
     * ------------------------------------------------------------------------
     */
    update(previousSeries, candle) {

        if (!this.state.initialized) {

            throw new Error(

                "EMA must be calculated before update()."

            );

        }

        const ema =

            (candle.close - this.state.lastEMA)

            * this.state.multiplier

            + this.state.lastEMA;

        this.state.lastEMA = ema;

        const points = [

            ...previousSeries.points,

            new IndicatorPoint({

                timestamp:

                    candle.timestamp,

                value:

                    this.round(ema)

            })

        ];

        return new IndicatorSeries({

            name:

                previousSeries.name,

            source:

                previousSeries.source,

            settings:

                previousSeries.settings,

            points

        });

    }

    /**
     * ------------------------------------------------------------------------
     * Reset
     * ------------------------------------------------------------------------
     */
    reset() {

        this.state = {

            lastEMA: null,

            multiplier: null,

            initialized: false

        };

    }

}