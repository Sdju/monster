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

            add(parent, type, handler) {
                if (!this.hooksMap[parent]) {
                    this.hooksMap[parent] = []
                }
                const hook = new Hook(type, handler, parent);
                hook.activate();
                this.hooksMap[parent].push(hook);
                return hook;
            },

            waitHook(parent, type, handler) {
                return new Promise((res, rej)=> {
                    this.add(parent, type, async function (...params) {
                        let result = await handler.apply(this, params);
                        if (result) {
                            this.deactivate();
                            res();
                        }
                    })
                })
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