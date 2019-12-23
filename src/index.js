require('./configs');
const systemModule = require('./modules/system');
const randomGamesModule = require('./modules/randomGames');
const gifsModule = require('./modules/gifs');
const otherModule = require('./modules/other');
const imagesModule = require('./modules/images');

const Processor = require('./classes/Processor');
const Hook = require('./classes/Hook');

const bot = new Processor();
bot.addModule(systemModule);
bot.addModule(randomGamesModule);
bot.addModule(gifsModule);
bot.addModule(otherModule);
bot.addModule(imagesModule);

bot.hookProcessor.activateHook(new Hook('message', message => {
    if (message.content.toLowerCase() === 'w') {
        if (message.author.id !== bot.client.user.id)
            message.channel.send('w');
    } else if (message.content === '^') {
        message.channel.send('I agree!')
    }
}));

bot.activate().then(()=> {
    for (const guild of bot.client.guilds.values()) {
        console.log(guild.name);
    }
    console.log('Activated');
});
