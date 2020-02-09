class VirtualMessage {
    constructor(data = {}) {
        this.data = data;
    }

    edit(data) {
        this.data = data;
    }
}

module.exports = VirtualMessage;
