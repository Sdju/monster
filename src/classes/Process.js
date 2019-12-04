const Hook = require('./Hook');
const Form = require('./Form');

class Process {
    constructor(message, command) {
        this.message = message;
        this.command = command;
        this.module = null;
        this.hookContainer = Hook.createHookContainer();
    }

    async run() {
        await this.command.handler.call(this, this.message);
        this.hookContainer.clear();
    }

    run() {
        this.command.handler.call(this, this.message);
    }
}

module.exports = Process;