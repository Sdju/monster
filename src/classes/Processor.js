const Emitter = require('events')
const Discord = require('discord.js');

const Hook = require('./Hook');

class Processor extends Emitter {
    constructor() {
        super()
        this.hookProcessor = Hook.createHookProcessor();
        this.client = new Discord.Client({
            partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'],
        });
        this.modules = [];
    }

    async activate() {
        for (const module of this.modules) {
            await module.hookProcessor.emit('activated', this)
        }

        this.client.on('message', (msg)=> {
            this.hookProcessor.emit('message', msg).then(()=>{}).catch();
        });

        this.client.on('messageReactionAdd', (msgReact, user)=> {
            this.hookProcessor.emit('reactionAdd', msgReact, user).then(()=>{}).catch();
        });

        this.client.on('raw', packet => {
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
            const channel = this.client.channels.get(packet.d.channel_id);
            if (channel.messages.has(packet.d.message_id)) return;
            channel.fetchMessage(packet.d.message_id).then(message => {
                const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                const reaction = message.reactions.get(emoji);
                if (reaction) reaction.users.set(packet.d.user_id, this.client.users.get(packet.d.user_id));
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    this.client.emit('messageReactionAdd', reaction, this.client.users.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    this.client.emit('messageReactionRemove', reaction, this.client.users.get(packet.d.user_id));
                }
            });
        });

        await this.client.login(process.env.DSC_KEY);

        await this.hookProcessor.emit('logined', this);
    }

    synthCall(cmd, message, prep) {
        this.hookProcessor.emit('synthCall', cmd, message, prep).then(()=>{}).catch()
    }

    addModule(module) {
        this.modules.push(module);
    }

    addModules(modules) {
        this.modules.push(...modules)
    }
}

module.exports = Processor;
