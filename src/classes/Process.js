const Hook = require('./Hook');
const Form = require('./Form');

class Process {
    constructor(message, command) {
        this.message = message;
        this.command = command;
        this.module = null;
        this.hookContainer = Hook.createHookContainer();
    }

    async run() {
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

    async answer(props, render = this.command.forms.answer) {
        const form = new Form(render);
        form.data = props;
        await form.create(this.message.channel);
        return form;
    }
}

module.exports = Process;