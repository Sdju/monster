const Module = require('./UserModule');
const Command = require('../../classes/Command');
const UserModel = require('../../models/User');

const userModule = new Module('user');

userModule.addCommand(new Command({
    name: 'user',
    meta: {
        help: {
            description: 'Выводит ваш опыт',
            sample: 'user'
        }
    },
    forms: {
        answer({exp}) {
            return {
                color: 0x3498DB,
                title: `:person_standing: Опыт`,
                description: exp + '',
            }
        },
    },
    async handler() {
        const mention = await this.getMember();
        const user = await this.module.getUser(((mention === void 0)
            ? this.message.author
            : mention.user).id);
        const form = await this.answer({exp: user.exp});
        setTimeout(()=> {
            form.update({exp: 500})
        }, 3000)

    },
}));

userModule.addCommand(new Command({
    name: 'daily',
    meta: {
        help: {
            description: 'Выводит ваш опыт',
            sample: 'user'
        }
    },
    forms: {
        answer({gold}) {
            return {
                color: 0x3498DB,
                title: `Теньге: `,
                description: gold + '',
            }
        },
    },
    async handler() {
        const mention = this.message.author.id;
        const user = await this.module.getUser(mention);
        await user.goldDaily();
        const form = await this.answer({gold: user.gold});

    },
}));

userModule.addCommand(new Command({
    name: 'refresh',
    meta: {
        help: {
            description: 'Выводит ваш опыт',
            sample: 'user'
        }
    },
    forms: {
        answer({}) {
            return {
                color: 0x3498DB,
                description: 'рефрешнуто',
            }
        },
    },
    async handler() {
        const mention = this.message.author.id;
        await UserModel.refresh();
        const form = await this.answer({});
    },
}));

module.exports = userModule;