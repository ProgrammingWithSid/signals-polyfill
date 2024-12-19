import { Effect } from "./effects.js";
import { Signal } from "./signals.js";

export class Computed {
    constructor(getter) {
        this._dirty = true;
        this._value = undefined;
        this._getter = getter;
        this._signal = new Signal(undefined);
        
        this._effect = new Effect(() => {
            const value = this._getter();
            this._value = value;
            this._dirty = false;
            return value;
        });
    }

    get value() {
        if (this._dirty) {
            this._effect.run();
        }
        return this._value;
    }
}

export function computed(fn) {
    const computed = new Computed(fn);
    return () => computed.value;
}