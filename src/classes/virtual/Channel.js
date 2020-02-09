const VirtualMessage = require('./Channel');

class VirtualChannel {
    constructor(listener) {
        this.listener = listener;
    }

    send(data) {
        if (this.listener.send) {
            return this.listener.send(data);
        } else {
            return new VirtualMessage(data);
        }
    }
}

module.exports = VirtualChannel;
