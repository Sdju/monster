const Hook = require('./Hook');

const prefix = '-';

class Module {
    constructor() {
        Hook.injectHookProcessor(this);

        this.commandList = [];
        this.commandMap = {};
        this.hooksForProcessor = [];
        this.activated = false;

        this.hookProcessor.activateHook(new Hook('activated', (processor)=> {
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
    }
}

module.exports = Module;