const Hook = require('./Hook');

const prefix = '-';

class Module {
    constructor() {
        this.hookProcessor = Hook.createHookProcessor();

        this.commandList = [];
        this.commandMap = {};
        this.activated = false;
        this.processor = null;

        this.hookProcessor.activateHook(new Hook('activated', (processor)=> {
            this.processor = processor;
            processor.hookProcessor.activateHook(new Hook('message', (message)=> {
                this.hookProcessor.emit('message', message).then(()=> {
                    if (message.content.startsWith(prefix)) {
                        const curCmdName = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
                        if (curCmdName in this.commandMap) {
                            message.text = message.content.slice(prefix.length + curCmdName.length);
                            return this.commandMap[curCmdName].exec(message);
                        }
                    }
                })
            }, processor))
        }, this));
    }

    addCommand(command) {
        this.commandList.push(command);
        let variants = [...command.aliases, command.name];
        for (let variant of variants) {
            if (variant in this.commandMap)
                throw new Error(`Commands name collision: ${command.name} (${variant})`);
            this.commandMap[variant] = command;
        }
        command.module = this;
    }
}

module.exports = Module;