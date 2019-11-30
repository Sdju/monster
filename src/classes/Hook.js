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

    static injectHookProcessor(object) {
        const hookProcessor = {
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
        object.hookProcessor = hookProcessor;
    }
}


module.exports = Hook;