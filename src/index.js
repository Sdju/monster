require('./configs');
const systemModule = require('./modules/system');

const Processor = require('./classes/Processor');

const bot = new Processor();
bot.addModule(systemModule);

bot.activate().then(()=> {
    console.log('Activated');
});
