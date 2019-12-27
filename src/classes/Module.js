const Hook = require('./Hook');

const prefix = '-';

class Module {
    constructor(name) {
        this.hookProcessor = Hook.createHookProcessor();

        this.commandList = [];
        this.commandMap = {};
        this.activated = false;
        this.processor = null;
        this.name = name;
        this.prefix = process.env.DEF_PREFIX;

        this.hookProcessor.activateHook(new Hook('activated', this.activatedHook.bind(this), this));
    }

    activatedHook(processor) {
        this.processor = processor;
        processor.hookProcessor.activateHook(new Hook('message', this.messageHook.bind(this), processor))
    }

    messageHook(message) {
        this.hookProcessor.emit('message', message).then(()=> {
            if (message.content.startsWith(this.prefix)) {

                const curCmdName = message.content.slice(this.prefix.length).split(' ')[0].toLowerCase();
                if (curCmdName in this.commandMap) {
                    message.text = message.content.slice(this.prefix.length + curCmdName.length).trim();
                    return this.commandMap[curCmdName].exec(message);
                }
            }
        })
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

    errorRender({exception, title = "", description}) {
        let msg = '';
        if (exception) {
            msg += '```' + exception.toString() + '```';
        }
        if (description) {
            msg += '\n' + description;
        }
        return {
            color: 0xAA3333,
            description: msg,
            title,
        }
    }
}

module.exports = Module;