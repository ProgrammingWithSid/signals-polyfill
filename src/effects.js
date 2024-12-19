export const effectStack = [];

function cleanup(effect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}

export class Effect {
    constructor(fn, scheduler = null) {
        this.fn = fn;
        this.scheduler = scheduler;
        this.active = true;
        this.deps = [];
        this.parent = null;
        this.run();
    }

    run() {
        if(!this.active) return;

        cleanup(this);
        const parent = effectStack[effectStack.length - 1];
        this._parent = parent;

        effectStack.push(this);
        try {
            this.fn();
        } finally {
            effectStack.pop();
            this.parent = null;
        }
    }
    stop() {
        if (this.active) {
            cleanup(this);
            this.active = false;
        }
    }
}

export function watchEffect(fn) {
    const effect = new Effect(fn);
    return () => effect.stop();
}