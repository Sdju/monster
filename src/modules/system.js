const Module = require('../classes/Module');
const Command = require('../classes/Command');
const Form = require('../classes/Form');

const systemModule = new Module();

systemModule.addCommand(new Command({
    name: 'ping',
    aliases: ['пинг'],
    meta: {
        help: {
            description: 'Текущий пинг до сервера',
            sample: 'ping'
        }
    },
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

systemModule.addCommand(new Command({
    name: 'invite',
    aliases: ['инвайт'],
    meta: {
        help: {
            description: 'Отправляет ссылку на приглашение бота на адмиинистрируемые вами сервера',
            sample: 'invite'
        }
    },
    forms: {
        answer({ invite }) {
            return {
                color: 0x3498DB,
                title: `:link: Приглашение бота на другие сервера`,
                description: `[${invite}](${invite})`,
            }
        },
    },
    async handler() {
        await this.answer({invite: await this.module.processor.client.generateInvite(8)});
    },
}));

systemModule.addCommand(new Command({
    name: 'waiter',
    meta: {},
    forms: {
        answer() {
            return {
                color: 0x3498DB,
                title: `:link: Ждун`,
                description: `ыыыы`,
            }
        },
    },
    async handler() {
        await this.answer({});
        await this.hookContainer.waitHook(this.module, 'message', (message)=> {
            if (message.author.id === this.module.processor.client.user.id) {
                return true;
            }
        });
        console.log('ДОЖДАЛСЯ');
    },
}));

module.exports = systemModule;
