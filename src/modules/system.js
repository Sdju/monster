const Module = require('../classes/Module');
const Command = require('../classes/Command');
const Form = require('../classes/Form');

const systemModule = new Module();

systemModule.addCommand(new Command({
    name: 'ping',
    aliases: ['пинг'],
    meta: {},
    forms: {
        answer({ ping }) {
            return {
                color: 0x3498DB,
                title: `:ping_pong: Пинг`,
                description: `Ping: ${Math.floor(ping)}ms`,
            }
        },
    },
    async handler() {
        await this.answer({ping: 500});
    },
}));

module.exports = systemModule;
