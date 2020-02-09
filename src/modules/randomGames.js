const crypto = require('crypto');
const request = require('request');
const Module = require('../classes/Module');
const Command = require('../classes/Command');

const randomGamesModule = new Module('games');

let md5 = (data)=>crypto.createHash('md5').update(data).digest('hex');

function getDickSize(id) {
    id = id + '';
    const normal = 100;
    let sum = 0;
    const idString = id + '';
    const code0 = '0'.charCodeAt(0);
    for (let i = 0; i < idString.length; i++)
        sum += (idString.charCodeAt(i) - code0) * Math.abs(Math.sin(i)) * i * 1.4;
    sum = (sum % normal) / normal;
    const val = 0.5 + ((sum - 0.5) * 1.5874) ** 3;
    return Math.round(val * 30 * 100) / 100;
}

function dickToString(dickSize, user) {
    let dickWidth = Array(user.id.slice(2) % 3).fill('*').join('');
    if (dickSize > 1 )
        return `${dickWidth}8${Array(Math.round(dickSize)).fill('=').join('')}>${dickWidth}\n(${dickSize} см)`;
    else
        return `:${(dickWidth === 0)? 'wilted_' : ''}rose:\n(${dickSize} см)`;
}

function createForm({message, val, title}) {
    const content = message.content;
    const pos = content.indexOf(' ');
    let txt = (pos === -1)? '' : content.slice(content.indexOf(' '));
    return {
        color: 3447003,
        title: `:game_die: ${title}`,
        fields: [{
                name: `**:question:  Вопрос**:`,
                value: `**${message.author}** : ${txt}`
            }, {
                name: `**:exclamation: Результат**:`,
                value: `${val}`,
            }]
    };
}

randomGamesModule.addCommand(new Command({
    name: 'dick',
    meta: {
        help: {
            description: 'выводит dick size указанного пользователя или свой собственный если юзер не указан',
            sample: 'dick [user]'
        },
    },
    forms: {
        answer({self, author, user}) {
            let msg = '';
            if (self) {
                msg = `${author.username} смотрит на свой член и видит: \n`
            } else {
                msg = `${author.username} интересуется размером члена ${user.username} и вот результат: \n`
            }
            const dickSize = getDickSize(user.id);
            let dickWidth = Array(user.id.slice(2) % 3).fill('*').join('');
            if (dickSize > 1 )
                msg += `${dickWidth}8${Array(Math.round(dickSize)).fill('=').join('')}>${dickWidth}\n(${dickSize} см)`;
            else
                msg += `:${(dickWidth === 0)? 'wilted_' : ''}rose:\n(${dickSize} см)`;
            return {
                color: 3447003,
                description: msg
            };
        }
    },
    async handler(message) {
        const mention = await this.getMember();
        const user = (mention === void 0)
            ? message.author
            : mention.user;
        this.answer({
            self: user === message.author,
            author: message.author,
            user,
        });
    }
}));

randomGamesModule.addCommand(new Command({
    name: 'dicktop',
    meta: {
        help: {
            description: 'выводит топ членов текущего канала',
            sample: 'dicktop'
        },
    },
    flags: {
        i: ['flag', false],
        c: ['int', 10],
    },
    forms: {
        answer({members}) {
            let msg = '';
            let id = 0;
            for (const member of members) {
                msg += `${++id}. ${member.name} : ${dickToString(member.dick, member.name.user)}\n`
            }
            return {
                color: 3447003,
                description: msg
            };
        }
    },
    async handler(message) {
        let members = [];
        for (let [,member] of message.channel.members) {
            members.push({
                dick: getDickSize(member.user.id),
                name: member,
            })
        }
        members.sort((lhs, rhs)=> {
            if (lhs.dick === rhs.dick) {
                return 0;
            } else if (lhs.dick > rhs.dick) {
                return 1;
            }
            return -1;
        });
        if (this.flags.i) {
            members = members.slice(0, this.flags.c)
        } else {
            members = members.slice(-this.flags.c).reverse()
        }
        await this.answer({members});
    }
}));

randomGamesModule.addCommand(new Command({
    name: 'roll',
    meta: {
        help: {
            description: 'ыводит случайное число от 1 до 10 или до указанного предела',
            sample: 'roll [max]'
        },
    },
    forms: {
        answer: createForm,
    },
    async handler(message) {
        const args = message.text.split(/ +/g).slice(0);
        if (typeof args[0] === 'string' && ((args[0].length > 10) || (args[0].trim()[0] === '-'))) {
            await this.error({title: 'некорректные параметры', description: 'слишком большое число'});
            return;
        }
        let raw = parseInt(args[0]);
        let max;
        if (Number.isNaN(raw)) {
            max = 100;
        } else if (raw < 2) {
            await this.error({title: 'некорректные параметры', description: 'слишком маленькое число'});
            return;
        } else {
            max = raw;
        }
        const val = Math.floor(Math.random() * max) + 1;
        await this.answer({message, val, title: 'Roll'});
    }
}));

randomGamesModule.addCommand(new Command({
    name: 'pick',
    aliases: ['выбери', 'choose'],
    meta: {
        help: {
            description: 'выводит случайно один из вариантов записанных через запятую',
            sample: 'pick var1, [var2, [var3, ...]]'
        },
    },
    forms: {
        answer: createForm,
    },
    async handler(message) {
        message.delete();
        let txt = message.content.slice(message.content.indexOf(' '));
        let vars = txt.split(',');
        let val = vars[Math.floor(vars.length * Math.random())];
        await this.answer({message, val, title: 'Pick'}, createForm);
    }
}));

randomGamesModule.addCommand(new Command({
    name: 'compatibility',
    aliases: ['совместимость', 'comp'],
    meta: {
        help: {
            description: 'выводит вашу совместимость с объектом из сообщения',
            sample: 'compatibility @smbd|text'
        },
    },
    forms: {
        answer: createForm,
    },
    async handler(message) {
        if (this.message.text.length === 0) {
            await this.error({title: 'некорректные параметры', description: 'необходиммо что-то для проверки совместимости'});
            return;
        }
        message.delete();
        let res = parseInt(md5(this.message.text + message.author.id).slice(0, 3), 16) % 101;
        let emoji = '';
        if (res === 100)
            emoji = ':gem:';
        else if (res > 80)
            emoji = ':heart:';
        else if (res > 50)
            emoji = ':blush:';
        else if (res > 30)
            emoji = ':expressionless:';
        else if (res > 10)
            emoji = ':angry:';
        else if (res !== 0)
            emoji = ':triumph:';
        else
            emoji = ':rage:';
        this.answer({message, val: `**${res}%** ${emoji}`, title: 'Compatibility'});
    }
}));

randomGamesModule.addCommand(new Command({
    name: 'maybe',
    aliases: ['мб', 'mb'],
    meta: {
        help: {
            description: 'выводит случайно YES или NO',
            sample: 'maybe [text]'
        },
    },
    forms: {
        answer: createForm,
    },
    async handler(message) {
        let val = (Math.random() > 0.5)? "YES" : "NO";
        this.answer({message, val, title: 'Maybe'});
    }
}));

module.exports = randomGamesModule;
