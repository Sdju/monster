const Module = require('../../classes/module');

class UserModule extends Module {
    async beforeCommand(message) {
        // const user = message.userModel;
        // await user.addExp();
    }
}

module.exports = UserModule;
