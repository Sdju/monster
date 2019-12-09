const Module = require('../classes/Module');
const Command = require('../classes/Command');
const ReactionControl = require('../classes/ReactionControl');
const Form = require('../classes/Form');

const systemModule = new Module('system');

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
            const form = await this.answer({ping: this.module.processor.client.ping});
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

systemModule.addCommand(new Command({
    name: 'counter',
    meta: {},
    forms: {
        answer({number}) {
            return {
                color: 0x3498DB,
                title: `:link: Итого:`,
                description: number,
            }
        },
    },
    async handler() {
        const form = await this.answer({number: 0});
        const collector = new ReactionControl({
            message: form.message,
            timeout: 30000,
            reactions: [
                ['◀', ()=>{
                    form.update({number: --form.data.number})
                }],
                ['▶', ()=>{
                    form.update({number: ++form.data.number})
                }],
                ['2️⃣', ()=>{
                    form.update({number: form.data.number * 2})
                }],
            ],
            autodelete: true,
        });
        await collector.start();
    },
}));

systemModule.addCommand(new Command({
    name: 'help',
    aliases: ['справка', 'помощь'],
    meta: {
        help: {
            description: 'выводит справку о имеющихся командах или справку по конкретной команде',
            sample: 'help [command]'
        }
    },
    forms: {
        about({command}) {
            let fields = [];
            if ((command.aliases !== void 0) && (command.aliases.length > 0)) {
                fields.push({
                    name: '**Варианты**',
                    value: 'ﾠ`' + command.aliases.join(', ') + '`'
                });
            }
            if (command.meta.help.description) {
                fields.push({
                    name: '**Описание**',
                    value: 'ﾠ' + command.meta.help.description
                });
            }
            if (command.meta.help.sample) {
                fields.push({
                    name: '**Использование**',
                    value: 'ﾠ-' + command.meta.help.sample
                })
            }
            return {
                color: 0x3498DB,
                title: `Информация о команде \`${'-' + command.name}\``,
                fields
            }
        },
        list({sections, page}) {
            const module = sections[page];
            const fields = [];
            for (const command of module.commandList) {
                if (command.meta.help !== void 0 && command.meta.help.description !== void 0)
                    fields.push('\`\`' + command.name + '\`\` - ' + command.meta.help.description + '.\n');
                else
                    fields.push('\`\`' + command.name + '\`\` - нет описания.\n');
            }
            return {
                color: 0x3498DB,
                title: `Информация о командах в модуле: ` + module.name,
                description: fields.join('') + `\nСтраница ${page + 1}/${sections.length}`,
            }
        },
    },
    async handler() {
        let help = this.message.text.toLowerCase();
        if (help.length > 0) {
            let cmd = null;
            for (const module of this.module.processor.modules) {
                if (help in module.commandMap) {
                    cmd = module.commandMap[help];
                    break
                }
            }
            if (cmd) {
                this.answer({command: cmd}, this.command.forms.about);
            } else {
                this.error({title: 'некорректные параметры', description: 'Данной команды у нас нет!'});
            }
        } else {
            let sections = this.module.processor.modules;
            let form = await this.answer({page: 0, sections}, this.command.forms.list);
            const collector = new ReactionControl({
                message: form.message,
                timeout: 60000,
                reactions: [
                    ['◀', ()=>{
                        const page = (form.data.page - 1 < 0)? sections.length - 1 : form.data.page - 1;
                        form.update({page})
                    }],
                    ['▶', ()=>{
                        const page = (form.data.page + 1 === sections.length)? 0 : form.data.page + 1;
                        form.update({page})
                    }],
                ],
                autodelete: true,
            });
            await collector.start();
        }
    }
}));

systemModule.addCommand(new Command({
    name: 'inviteto',
    meta: {
        help: {
            description: 'Создает инвайт ',
            sample: 'inviteTo [channel]'
        }
    },
    forms: {
        answer({ invite, channel }) {
            return {
                color: 0x3498DB,
                title: `:link: Создан инвайт для канала #${channel.name}`,
                description: `[${invite}](${invite})`,
            }
        },
    },
    flags: {
        c: ['channel', null],
    },
    async handler() {
        if (this.flags.c) {
            await this.answer({invite: (await this.flags.c.createInvite()).toString(), channel: this.flags.c});
        } else {
            this.error({title: 'некорректные параметры', description: 'Необходим канал для приглошения!'})
        }
    },
}));

function format(seconds) {
    function pad(s){
        return (s < 10 ? '0' : '') + s;
    }
    const hours = Math.floor(seconds / (60*60));
    const minutes = Math.floor(seconds % (60*60) / 60);
    seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}
systemModule.addCommand(new Command({
    name: 'info',
    meta: {
        help: {
            description: 'Информация о боте',
            sample: 'info'
        }
    },
    forms: {
        answer({ client }) {
            return {
                color: 0x3498DB,
                title: client.user.username,
                thumbnail: {
                    url: client.user.avatarURL,
                },
                fields: [
                    {
                        name: 'Версия',
                        value: require('../../package').version,
                        inline: true,
                    },
                    {
                        name: 'Аптайм',
                        value: format(process.uptime()),
                        inline: true,
                    },
                    {
                        name: 'Создатель',
                        value: 'zede#0852',
                        inline: true,
                    },
                    {
                        name: 'Серверов',
                        value: client.guilds.size,
                        inline: true,
                    },
                    {
                        name: 'Пользователей',
                        value: client.users.size,
                        inline: true,
                    }
                ],
                description: `[github](https://github.com/Sdju/monster)`
            }
        },
    },
    async handler() {
        this.answer({client: this.module.processor.client})
    },
}));

module.exports = systemModule;
