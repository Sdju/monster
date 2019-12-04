class Hook {
    constructor(type, handler, parent = null) {
        this.type = type;
        this.handler = handler;
        this.parent = parent;
    }

    deactivate() {
        this.parent.hookProcessor.deactivateHook(this)
    }

    activate() {
        this.parent.hookProcessor.activateHook(this)
    }

    static createHookProcessor() {
        return {
            hookSet: new Set(),
            hooksMap: {},
            activateHook(hook) {
                if (this.hookSet.has(hook)) {
                    return;
                }
                this.hookSet.add(hook);
                if (!(hook.type in this.hooksMap)) {
                    this.hooksMap[hook.type] = []
                }
                this.hooksMap[hook.type].push(hook)
            },
            deactivateHook(hook) {
                if (!this.hookSet.has(hook)) {
                    return;
                }
                this.hookSet.delete(hook);
                const list = this.hooksMap[hook.type];
                list.splice(list.indexOf(hook), 1)
            },
            async emit(type, ...params) {
                if (!this.hooksMap[type]) {
                    return;
                }
                for (const hook of this.hooksMap[type]) {
                    await hook.handler.apply(hook, params);
                }
            }
        };
    }

    static createHookContainer() {
        return {
            hooksMap: {},

            add(target, type, handler, parent = null) {
                if (!this.hooksMap[target]) {
                    this.hooksMap[target] = []
                }
                const hook = new Hook(type, handler, parent);
                target.hookProcessor.activateHook(hook);
                this.hooksMap[target].push(hook);
                return hook;
            },

            clear() {
                for (const target in this.hooksMap) {
                    for (const hook of this.hooksMap[target]) {
                        hook.deactivate()
                    }
                }
            },
        }
    }
}


module.exports = Hook;