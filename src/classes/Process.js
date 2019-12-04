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

    async answer(props, render = this.command.forms.answer) {
        const form = new Form(render);
        form.data = props;
        await form.create(this.message.channel);
        return form;
    }
}

module.exports = Process;