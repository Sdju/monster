const Module = require('../classes/Module');
const Command = require('../classes/Command');
let request = require('request');

const otherModule = new Module('other');

function genFooter(message) {
    return {
        text: message.author.username,
        icon_url: message.author.avatarURL
    };
}

otherModule.addCommand(new Command({
    name: 'avatar',
    aliases: ['ava'],
    meta: {
        help: {
            description: 'выводит автар указанного пользователя или свой собственный если юзер не указан',
            sample: 'avatar [user]'
        }
    },
    forms: {
        answer({ user, message }) {
            return {
                color: 3447003,
                title: user.tag,
                image: {
                    url: user.avatarURL,
                    height: 200,
                    width: 200
                },
                footer: genFooter(message)
            }
        },
    },
    async handler() {
        const mention = await this.getMember();
        const user = (mention === void 0)
            ? this.message.author
            : mention.user;
        this.answer({user, message: this.message});
    },
}));

otherModule.addCommand(new Command({
    name: 'emoji',
    aliases: ['e'],
    meta: {
        help: {
            description: 'выводит emoji в полном размере',
            sample: 'emoji emoji'
        }
    },
    forms: {
        answer({ res, message }) {
            return {
                color: 3447003,
                image: {
                    url: `https://cdn.discordapp.com/emojis/${res[2]}.${(res[1])?'gif':'png'}`,
                },
                footer: genFooter(message)
            }
        },
    },
    async handler() {
        const res = /<(a?):[A-Za-z_0-9\-	]+:(\d+)>/.exec(this.message.content);
        if (res) {
            this.answer({res, message: this.message});
        } else {
            this.error({title: 'некорректные параметры', description: 'Неподдерживаемый или несуществующий emoji!'})
        }
    },
}));

otherModule.addCommand(new Command({
    name: 'say',
    meta: {
        help: {
            description: 'выводит указанный текст от имени бота',
            sample: 'say text'
        }
    },
    forms: {
        answer({ text }) {
            return text;
        },
    },
    async handler() {
        let text = this.message.text;
        console.log(text);
        this.message.delete();
        this.answer({text});
    },
}));

module.exports = otherModule;