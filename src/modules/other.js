const Module = require('../classes/Module');
const Command = require('../classes/Command');
const Hook = require('../classes/Hook');
const Process = require('../classes/Process');

let request = require('request');

const otherModule = new Module('other');

function genFooter(message) {
    return {
        text: message.author.username,
        icon_url: message.author.avatarURL
    };
}

const replyRender = ({msg, author})=> {
    if (msg.embed) {
        return {
            ...msg.embed
        };
    } else {
        return {
            description: msg.content,
            author: {
                icon_url: msg.author.avatarURL,
                url: msg.url,
                name: 'от: ' + msg.author.tag
            },
            footer: {
                text: author.username,
                icon_url: author.avatarURL
            },
        }
    }
};

otherModule.hookProcessor.activateHook(new Hook('reactionAdd', function(msgReact, user) {
    const emoji = msgReact.emoji;
    if (emoji.name === '©️') {
        const msg = msgReact.message;
        const process = new Process(msg);
        msgReact.remove(user);
        process.answer({msg, author: user}, replyRender);
    } else if (emoji.name === '😠') {
        const msg = msgReact.message;
        const process = new Process(msg);
        msgReact.remove(user);
        otherModule.processor.synthCall('bad', msg, (msg)=> {
            msg.forceMention = msg.author;
            return msg;
        });
        process.answer({msg, author: user}, replyRender);
    }
}, otherModule));

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
        if (this.message.author.id === '346366231181262848') {
            text = '<@!346366231181262848> себе это, блят, скажи'
        } else {
            this.message.delete();
        }
        console.log(text);

        this.answer({text});
    },
}));

module.exports = otherModule;