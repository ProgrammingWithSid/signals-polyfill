import { effectStack } from './effects.js';

export class Signal {
    constructor(value) {
        this._value = value;
        this.subscribers = new Set();
    }

    get value() {
        const activeEffect = effectStack[effectStack.length - 1];
        if (activeEffect) {
            this.subscribers.add(activeEffect);
        }
        return this._value;
    }

    set value(newValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.notify();
        }
    }

    notify() {
        this.subscribers.forEach(effect => {
            if (effect.scheduler) {
                effect.scheduler();
            } else {
                effect.run();
            }
        });
    }
}

export function createSignal(initialValue) {
    const signal = new Signal(initialValue);
    return [
        () => signal.value,
        (newValue) => { signal.value = newValue; }
    ];
}