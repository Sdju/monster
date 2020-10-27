const Module = require('./UserModule');
const Command = require('../../classes/Command');

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
            ? this.message.author.id
            : mention.user).id);
        const form = await this.answer({exp: user.exp});
        setTimeout(()=> {
            form.update({exp: 500})
        }, 3000)
    },
}));

module.exports = userModule;