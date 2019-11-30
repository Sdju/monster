const Module = require('../classes/Module');
const Command = require('../classes/Command');

const systemModule = new Module();

systemModule.addCommand(new Command({
    name: 'ping',
    aliases: ['пинг'],
    meta: {},
    handler() {
        this.message.channel.send('pong!');
    },
}));

module.exports = systemModule;
