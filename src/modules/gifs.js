const Module = require('../classes/Module');
const Command = require('../classes/Command');
let request = require('request');

const gifsModule = new Module('actions');

let download = function(uri) {
    return new Promise((resolve, reject)=>{
        request(uri, (err, res, body)=> {
            if(err)
                reject(err);
            resolve(body);
        });
    });
};

async function tenorSearch(key) {
    const results = JSON.parse(await download(`https://api.tenor.com/v1/search?q=anime-${key}&key=RLXYOPOEZVNG&limit=15`)).results;
    return results.map(desc=>desc.media[0].gif.url);
}

async function createForm({message, gifs, mention, msgSelf, msgSmbd}) {
    const source = ((mention === void 0) || (mention.id === message.author.id)) ? msgSelf : msgSmbd;
    const txt = source.replace(/\%author\%/g, message.author).replace(/\%target\%/g, mention);
    return {
        color: 3447003,
        description: txt,
        image: {
            url: gifs[Math.floor(Math.random() * gifs.length)],
            height: 200,
            width: 200
        }
    };
}

function actionCommandGenerator(params) {
    for (const param of params) {
        gifsModule.addCommand(new Command({
            name: param.name,
            aliases: [...param.aliases],
            section: 'action',
            meta: {
                help: {
                    description: param.desc,
                    usage: `${param.name} [@smb]`
                },
            },
            forms: {
                answer: createForm,
            },
            async handler(message) {
                const mention = await this.getMember();
                const gifs = await tenorSearch(param.tag);
                this.answer({message, gifs, mention, msgSelf: param.self, msgSmbd: param.target});
            }
        }));
    }
}

actionCommandGenerator([
    {
        name: 'hug',
        aliases: ['обнимашки'],
        desc: '',
        tag: 'hug',
        self: '%author% обнимает сам себя :fearful:',
        target: '%author% обнимается с %target%'
    },
    {
        name: 'poke',
        aliases: ['тык'],
        desc: '',
        tag: 'poke',
        self: '%author% тыкает самого себя. зачем? :fearful:',
        target: '%author% тычет %target%. Ай! <:kotZHIR:394924252165570560>'
    },
    {
        name: 'slap',
        aliases: ['ударить'],
        desc: '',
        tag: 'slap',
        self: '%author% избивает сам себя?? :fearful:',
        target: '%author% ударил(а) %target%, значит есть за что!'
    },
    {
        name: 'bad',
        aliases: ['плохой', 'punch', 'baka', 'бака'],
        desc: '',
        tag: 'punch',
        self: '%author% собирается наказатьь самого себя? :fearful:',
        target: '%author% влепил(а) %target%, кто-то был настоящим бакой!'
    },
    {
        name: 'lick',
        aliases: ['лизнуть'],
        desc: '',
        tag: 'lick',
        self: '%author% вылизывает самого себя :smirk_cat:',
        target: '%author% облизал(а) %target%, но приятно ли это? :yum: '
    },
    {
        name: 'pat',
        aliases: ['похлопать'],
        desc: '',
        tag: 'pat',
        self: '%author% похлопал(а) самого себя :fearful:',
        target: '%author% похвалил(а) %target%'
    },
    {
        name: 'kiss',
        aliases: ['поцеловать'],
        desc: '',
        tag: 'kiss',
        self: '%author% засосал(а) самого себя :fearful:',
        target: '%author% целуется с %target%, они так мило смотрятся вместе :relaxed:'
    },
    {
        name: 'tired',
        aliases: ['устал'],
        desc: '',
        tag: 'tired',
        self: '%author% явно очень устал <:kotLezhu:593540539094401034>',
        target: '%author% устал от %target% <:kotLezhu:593540539094401034>'
    },
    {
        name: 'waa',
        aliases: ['cry', 'ваа'],
        desc: '',
        tag: 'cry',
        self: '%author% почему-то очень грустит :sob:',
        target: '%target% очень расстроил(а) %author% :sob:'
    },
    {
        name: 'nom',
        aliases: ['трапеза', 'кусь'],
        desc: '',
        tag: 'nom',
        self: '%author% был таким голодным, что укусил сам себя :fearful:',
        target: '%author% укусил %target%! Ой, кажется, теперь %target% стал меньше.'
    },
    {
        name: 'triggered',
        aliases: ['триггеред'],
        desc: '',
        tag: 'triggered',
        self: '%author% затриггерен(а) :japanese_goblin:',
        target: '%target% затриггерил(а) %author%! :japanese_goblin: '
    },
    {
        name: 'zzz',
        aliases: ['вырубился'],
        desc: '',
        tag: 'sleep',
        self: '%author% определенно засыпает :sleeping: ',
        target: 'от %target% %author% хочет вырубиться :sleeping:'
    },
    {
        name: 'dance',
        aliases: ['танeц'],
        desc: '',
        tag: 'dance',
        self: '%author% зажигает <a:gif2Sway:406043092525907978> <a:gif2B:406042995633160193> ',
        target: '%target% зажигает с %author%, вах красавцы  <a:gif2Sway:406043092525907978> <a:gif2B:406042995633160193>'
    },
    {
        name: 'hello',
        aliases: ['ку', 'привет', 'hi'],
        desc: '',
        tag: 'hello',
        self: '%author% приветствует вас <:aniNyanpasu:383562507958091786>',
        target: '%author% приветствует %target% <:aniNyanpasu:383562507958091786> '
    },
    {
        name: 'bye',
        aliases: ['пока', 'поки'],
        desc: '',
        tag: 'bye',
        self: '%author% прощается со всеми',
        target: ' %author% прощается с %target%'
    },
    {
        name: 'jojo',
        aliases: ['жожо', 'жожи'],
        desc: '',
        tag: 'jojo',
        self: 'всем жожи!',
        target: ' %author% жожится с %target%'
    },
    {
        name: 'disgust',
        aliases: ['ble', 'бле', 'фу'],
        desc: '',
        tag: 'disgust',
        self: '%author% испытытывает отвращение <:kotBlee:401080622669496322>',
        target: '%target% довел %author% до отвращения! <:kotBlee:401080622669496322>'
    },
    {
        name: 'bebe',
        aliases: ['бе', 'bleh'],
        desc: '',
        tag: 'bleh',
        self: '%author% бебебе! <:twLUL:365831853145325568>',
        target: '%target%, %author% передает тебе фигу! <:twLUL:365831853145325568>'
    },
    {
        name: 'facepalm',
        aliases: ['fp', 'азздц'],
        desc: '',
        tag: 'facepalm',
        self: '%author% думает что это пиздец! <:twNotLikeThis:365831838385700867>',
        target: '%target%, %author% думает что это какой-то пиздец! <:twNotLikeThis:365831838385700867>'
    },
    {
        name: 'gosleep',
        aliases: ['спать', 'zzzWith'],
        desc: '',
        tag: 'sleep',
        self: '%author% одиноко засыпает :sleeping: ',
        target: '%target% спит вместе с %author% милашки <:twKyawawa:369202690166882314>'
    },
    {
        name: 'watch',
        aliases: ['watching'],
        desc: '',
        tag: 'watch',
        self: '%author% смотрит на себя, интересно, что же он(а) там увидел(а)? :thinking:',
        target: '%author% посмотрел(а) на %target%, интересно, что же он(а) там увидел(а)? :thinking:'
    },
    {
        name: 'wow',
        aliases: ['aww', 'ауф'],
        desc: '',
        tag: 'wow',
        self: '%author% в восхищении',
        target: '%author% восхищен %target%'
    },
]);

module.exports = gifsModule;