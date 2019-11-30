

class Process {
    constructor(message, command) {
        this.message = message;
        this.command = command;
    }

    run() {
        this.command.handler.call(this, this.message);
    }
}

module.exports = Process;