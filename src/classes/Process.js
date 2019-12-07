const Hook = require('./Hook');
const Form = require('./Form');
const ReactionControl = require('./ReactionControl');

const pageSize = 5;
const emojiByNumber = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:'];
const selectMentionRender = ({members, page})=> {
    const fields = members.slice(page * pageSize, (page + 1) * pageSize)
        .map((member, index) => `${emojiByNumber[index]}: ${member}`)
        .join('\n');
    return {
        color: 3447003,
        title: `:person_standing: Выберите пользователя нажав соответствующий эмоут`,
        description: `Страница ${page + 1}/${Math.ceil(members.length / pageSize)}\n` + fields,
    }
};

class Process {
    constructor(message, command) {
        this.message = message;
        this.command = command;
        this.module = null;
        this.hookContainer = Hook.createHookContainer();
    }

    async run() {
        this.flags = this.getFlags();
        await this.command.handler.call(this, this.message);
        this.hookContainer.clear();
    }

    getFlags(flags = this.command.flags) {
        let res = {};
        for (let key in flags) {
            let req = flags[key];
            if (typeof req === 'string') {
                req = {type: req};
            } else if (Array.isArray(req)) {
                req = {type: req[0], def: req[1]};
            }

            if (req.type === 'channel') {
                const val =  (new RegExp(`${key}=\\<\\#(\\d+)\\>`)).exec(this.message.content);
                res[key] = this.message.guild.channels.get(val[1]);
            } else if (req.type === 'flag') {
                let val = ((new RegExp(`\\s${key}(\\s+|$)`)).exec(this.message.content));
                if (val)
                    res[key] = !!val;
            } else if (req.type === 'value') {
                let val = (new RegExp(`\\s${key}=(\\S+)(\\s+|$)`)).exec(this.message.content);
                if (val)
                    val = val[1];
                res[key] = val;
            } else if (req.type === 'int') {
                let val = (new RegExp(`\\s${key}=(\\d+)(\\s+|$)`)).exec(this.message.content);
                if (val)
                    val = parseInt(val[1]);
                res[key] = val;
            }  else if (req.type === 'float') {
                let val = (new RegExp(`\\s${key}=(\\d+(?:(?:\\.|\\,)\d+)?)(\\s+|$)`)).exec(this.message.content);
                if (val)
                    val = parseFloat(val[1].replace(',', '.'));
                res[key] = val;
            }

            if (!(key in res) || (res[key] === null) && ('def' in req))
                res[key] = req.def;
        }
        return res;
    }

    async getMember() {
        const mention = this.message.mentions.members.first();
        if (mention) {
            return mention;
        }
        if(!this.message.text) {
            return undefined;
        }
        const search = this.message.text.toLowerCase();
        let vars = [];
        for (const [, member] of this.message.channel.members) {
            if ((member.nickname && member.nickname.toLowerCase().includes(search)) || (member.user.tag.toLowerCase().includes(search))) {
                vars.push(member)
            }
        }
        if (vars.length === 0) {
            return undefined
        }
        if (vars.length === 1) {
            return vars[0];
        }
        // dialog of select
        return await new Promise(async (res, rej)=> {
            const form = await this.answer({members: vars, page: 0}, selectMentionRender);
            const pageCount = Math.ceil(form.data.members.length / pageSize);
            const selectorGenerator = (id)=> ()=> {
                const curPage = vars.slice(form.data.page * pageSize, (form.data.page + 1) * pageSize);
                if (curPage.length > id) {
                    form.delete();
                    res(curPage[id]);
                }
            };
            const collector = new ReactionControl({
                message: form.message,
                timeout: 3000000,
                reactions: [
                    ['◀', ()=>{
                        const page = (form.data.page - 1 < 0)? pageCount - 1 : form.data.page - 1;
                        form.update({page})
                    }],
                    ['▶', ()=>{
                        const page = (form.data.page + 1 === pageCount)? 0 : form.data.page + 1;
                        form.update({page})
                    }],
                    ['1️⃣', selectorGenerator(0)],
                    ['2️⃣', selectorGenerator(1)],
                    ['3️⃣', selectorGenerator(2)],
                    ['4️⃣', selectorGenerator(3)],
                    ['5️⃣', selectorGenerator(4)],
                ],
                autodelete: true,
                filter: (reaction, user)=> {
                    return this.message.author.id === user.id
                }
            });
            await collector.start();
        });
    }

    async answer(props, render = this.command.forms.answer) {
        const form = new Form(render);
        form.data = props;
        await form.create(this.message.channel);
        return form;
    }
}

module.exports = Process;