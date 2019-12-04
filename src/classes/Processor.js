const Discord = require('discord.js');

const Hook = require('./Hook');

class Processor {
    constructor() {
        this.hookProcessor = Hook.createHookProcessor();
        this.client = new Discord.Client();
        this.modules = []
    }

    async activate() {
        for (const module of this.modules) {
            await module.hookProcessor.emit('activated', this)
        }

        this.client.on('message', (msg)=> {
            this.hookProcessor.emit('message', msg).then(()=>{}).catch();
        });

        await this.client.login(process.env.DSC_KEY);

        await this.hookProcessor.emit('logined', this);
    }

    addModule(module) {
        this.modules.push(module);
    }
}

module.exports = Processor;