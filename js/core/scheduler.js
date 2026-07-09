/**
 * ============================================================================
 * Signal Terminal Pro
 * Scheduler Service
 * ============================================================================
 */

import { logger } from "./logger.js";

class Scheduler {

    constructor() {
        this.tasks = new Map();
    }

    /**
     * Register and start a repeating task.
     *
     * @param {string} name
     * @param {Function} callback
     * @param {number} interval
     */
    add(name, callback, interval) {

        if (this.tasks.has(name)) {
            this.stop(name);
        }

        const timer = setInterval(() => {

            try {
                callback();
            } catch (error) {
                logger.error(`Scheduler task "${name}" failed.`, error);
            }

        }, interval);

        this.tasks.set(name, {
            name,
            callback,
            interval,
            timer,
            running: true
        });

        logger.info(`Scheduler started: ${name}`);
    }

    /**
     * Stop a task.
     *
     * @param {string} name
     */
    stop(name) {

        const task = this.tasks.get(name);

        if (!task) {
            return;
        }

        clearInterval(task.timer);

        this.tasks.delete(name);

        logger.info(`Scheduler stopped: ${name}`);
    }

    /**
     * Restart a task.
     *
     * @param {string} name
     */
    restart(name) {

        const task = this.tasks.get(name);

        if (!task) {
            return;
        }

        this.add(name, task.callback, task.interval);
    }

    /**
     * Stop every running task.
     */
    stopAll() {

        for (const task of this.tasks.values()) {
            clearInterval(task.timer);
        }

        this.tasks.clear();

        logger.info("All scheduler tasks stopped.");
    }

    /**
     * Check if a task exists.
     *
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.tasks.has(name);
    }

    /**
     * Get a task by name.
     *
     * @param {string} name
     * @returns {object|null}
     */
    get(name) {
        return this.tasks.get(name) ?? null;
    }

    /**
     * Get all registered tasks.
     *
     * @returns {Array}
     */
    list() {
        return [...this.tasks.values()];
    }

}

export const scheduler = new Scheduler();