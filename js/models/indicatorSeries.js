/**
 * ============================================================================
 * Signal Terminal Pro
 * Indicator Series
 * Version: 2.0.0
 * ============================================================================
 *
 * Immutable collection of IndicatorPoint objects.
 *
 * Every indicator (EMA, RSI, MACD, ATR, ADX, etc.) returns an
 * IndicatorSeries.
 *
 * Responsibilities
 * ----------------
 * • Immutable storage
 * • Efficient read API
 * • Safe append()
 * • Collection utilities
 * • Iteration support
 * • Serialization
 * ============================================================================
 */

import { IndicatorPoint } from "./indicatorPoint.js";

export class IndicatorSeries {

    constructor({

        name,

        source,

        settings = {},

        points = []

    }) {

        if (typeof name !== "string" || name.trim() === "") {

            throw new TypeError(
                "IndicatorSeries requires a valid name."
            );

        }

        this.name = name;

        this.source = source;

        this.settings = Object.freeze({
            ...settings
        });

        this._points = Object.freeze(
            points.map(point => {

                if (!(point instanceof IndicatorPoint)) {

                    throw new TypeError(
                        "Every series item must be an IndicatorPoint."
                    );

                }

                return point;

            })
        );

        Object.freeze(this);

    }

    /* -------------------------------------------------------------------------
     * Metadata
     * ---------------------------------------------------------------------- */

    getName() {

        return this.name;

    }

    getSource() {

        return this.source;

    }

    getSettings() {

        return this.settings;

    }

    /* -------------------------------------------------------------------------
     * Collection
     * ---------------------------------------------------------------------- */

    count() {

        return this._points.length;

    }

    length() {

        return this.count();

    }

    isEmpty() {

        return this.count() === 0;

    }

    first() {

        return this._points[0] ?? null;

    }

    latest() {

        return this._points.at(-1) ?? null;

    }

    previous() {

        return this._points.at(-2) ?? null;

    }

    at(index) {

        return this._points.at(index) ?? null;

    }

    get(index) {

        return this.at(index);

    }

    points() {

        return [...this._points];

    }

    /* -------------------------------------------------------------------------
     * Values
     * ---------------------------------------------------------------------- */

    values() {

        return this._points.map(point => point.getValue());

    }

    timestamps() {

        return this._points.map(point => point.getTimestamp());

    }

    latestValue() {

        return this.latest()?.getValue() ?? null;

    }

    latestTimestamp() {

        return this.latest()?.getTimestamp() ?? null;

    }

    /* -------------------------------------------------------------------------
     * Immutable Operations
     * ---------------------------------------------------------------------- */

    append(point) {

        if (!(point instanceof IndicatorPoint)) {

            throw new TypeError(
                "append() requires an IndicatorPoint."
            );

        }

        return new IndicatorSeries({

            name: this.name,

            source: this.source,

            settings: this.settings,

            points: [

                ...this._points,

                point

            ]

        });

    }

    slice(start, end) {

        return new IndicatorSeries({

            name: this.name,

            source: this.source,

            settings: this.settings,

            points: this._points.slice(start, end)

        });

    }

    filter(callback) {

        return new IndicatorSeries({

            name: this.name,

            source: this.source,

            settings: this.settings,

            points: this._points.filter(callback)

        });

    }

    map(callback) {

        return this._points.map(callback);

    }

    forEach(callback) {

        this._points.forEach(callback);

    }

    some(callback) {

        return this._points.some(callback);

    }

    every(callback) {

        return this._points.every(callback);

    }

    find(callback) {

        return this._points.find(callback);

    }

    /* -------------------------------------------------------------------------
     * Iteration
     * ---------------------------------------------------------------------- */

    [Symbol.iterator]() {

        return this._points[Symbol.iterator]();

    }

    /* -------------------------------------------------------------------------
     * Serialization
     * ---------------------------------------------------------------------- */

    toJSON() {

        return {

            name: this.name,

            source: this.source,

            settings: this.settings,

            points: this._points.map(point => point.toJSON())

        };

    }

}