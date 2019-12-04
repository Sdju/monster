// React version for Discord

class Form {
    constructor(render) {
        this.render = render;
        this.data = {};
        this.message = null;
    }

    async create(channel) {
        let msgData = await this.render(this.data);
        if (typeof msgData === 'object') {
            msgData = {embed: msgData};
        }
        this.message = await channel.send(msgData);
        return this.message;
    }

    async update() {
        let msgData = await this.render(this.data);
        if (typeof msgData === 'object') {
            msgData = {embed: msgData};
        }
        await this.message.edit(msgData);
    }
}

module.exports = Form;