const Process = require('./Process');

class Command {
    constructor(params) {
        if ((typeof params.name !== 'string') || (typeof params.handler !== 'function')) {
            throw new Error("'name' and 'handler' is required param");
        }

        this.name = params.name;
        this.handler = params.handler;

        this.aliases = params.aliases || [];
        this.meta = params.meta;
        this.filters = params.filters || [];
        if (params.forms) {
            this.forms = params.forms;
        }
        this.flags = params.flags || {};
        this.module = null;
        this.processClass = params.processClass || Process;
    }

    async filtering(message) {
        for (const filter of this.filters) {
            if (!await filter(this, message)) {
                return false;
            }
        }
        return true;
    }

    async exec(message) {
        let process;
        try {
            if (await this.filtering(message)) {
                process = new this.processClass(message, this);
                process.module = this.module;
                await process.run();
            }
        } catch(exception) {
            process.error({title: 'некорректные параметры', description: 'Необходимо изображение для обработки!', exception})
        }
    }
}

module.exports = Command;