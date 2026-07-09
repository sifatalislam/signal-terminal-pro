/**
 * ============================================================================
 * Signal Terminal Pro
 * Event Bus
 * ============================================================================
 */

class EventBus {

    constructor() {
        this.events = new Map();
    }

    /**
     * Register an event listener.
     *
     * @param {string} event
     * @param {Function} listener
     * @returns {Function} unsubscribe function
     */
    on(event, listener) {

        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }

        const listeners = this.events.get(event);
        listeners.add(listener);

        return () => this.off(event, listener);
    }

    /**
     * Register a listener that fires once.
     *
     * @param {string} event
     * @param {Function} listener
     */
    once(event, listener) {

        const wrapper = (payload) => {
            this.off(event, wrapper);
            listener(payload);
        };

        this.on(event, wrapper);
    }

    /**
     * Remove a listener.
     *
     * @param {string} event
     * @param {Function} listener
     */
    off(event, listener) {

        const listeners = this.events.get(event);

        if (!listeners) {
            return;
        }

        listeners.delete(listener);

        if (listeners.size === 0) {
            this.events.delete(event);
        }
    }

    /**
     * Emit an event.
     *
     * @param {string} event
     * @param {*} payload
     */
    emit(event, payload = null) {

        const listeners = this.events.get(event);

        if (!listeners) {
            return;
        }

        for (const listener of listeners) {
            try {
                listener(payload);
            } catch (error) {
                console.error(`EventBus listener failed for "${event}"`, error);
            }
        }
    }

    /**
     * Remove all listeners.
     */
    clear() {
        this.events.clear();
    }

    /**
     * Check if an event has listeners.
     *
     * @param {string} event
     * @returns {boolean}
     */
    has(event) {
        return this.events.has(event);
    }

    /**
     * Get listener count.
     *
     * @param {string} event
     * @returns {number}
     */
    listenerCount(event) {

        return this.events.has(event)
            ? this.events.get(event).size
            : 0;
    }

}

export const eventBus = new EventBus();