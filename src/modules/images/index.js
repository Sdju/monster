const Module = require('../../classes/Module');
const Command = require('../../classes/Command');
const ImageProcess = require('./ImageProcess');

const createGm = function(inputFile, outputFile) {
    let newGm = {
        tmp() {
            return new Promise((res, rej) => {
                newGm.write(outputFile);
            });
        }
    };
    newGm.__proto__ = gm(inputFile);
    return newGm;
};



const imagesModule = new Module('images');



imagesModule.addCommand(new Command({
    name: 'negate',
    meta: {
        help: {
            description: 'Воззвращает изображение с инвертированными цветами',
            sample: 'negate [image]'
        }
    },
    processClass: ImageProcess,
    async handler() {
        const data = await this.gm.background('none').$(`-channel RGB -negate`).save();
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'sepia',
    meta: {
        help: {
            description: 'Воззвращает изображение в сепии',
            sample: 'sepia [image]'
        }
    },
    processClass: ImageProcess,
    async handler() {
        const data = await this.gm.$(`( -background none ( +clone -sepia-tone 50% ) -average )`).save();
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'pixel',
    meta: {
        help: {
            description: 'Воззвращает пиксельное изобрражение',
            sample: 'pixel [image]'
        }
    },
    processClass: ImageProcess,
    async handler() {
        const data = await this.gm.background('none').scale(50).scale(200).save();
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'gotham',
    meta: {
        help: {
            description: 'Воззвращает в стиле готтема',
            sample: 'gotham [image]'
        }
    },
    flags: {
        v: ['int', '20'],
        a: ['flag', false],
    },
    processClass: ImageProcess,
    async handler() {

        let data;
        if (this.flags.a) {
            data = await this.gm.background('none').$('-virtual-pixel background ( +clone -modulate 120,10,100 -fill #222b6d -colorize 20 -gamma 0.7 -contrast ) -morph 15 -duplicate 1,-2-1 -set delay 5 -loop 0').save();
        } else {
            data = await this.gm.background('none').$('-modulate 120,10,100 -fill #222b6d -colorize 20 -gamma 0.7 -contrast').save();
        }
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'blur',
    meta: {
        help: {
            description: 'Воззвращает изображение c блюром',
            sample: 'blur [image]'
        }
    },
    flags: {
        v: ['int', '20'],
        a: ['flag', false],
    },
    processClass: ImageProcess,
    async handler() {
        let data;
        if (this.flags.a) {
            data = await this.gm.background('none').$('-virtual-pixel background ( +clone -blur ' + this.flags.v + 'x' + this.flags.v + ' ) -morph 15 -duplicate 1,-2-1 -set delay 5 -loop 0').save();
        } else {
            data = await this.gm.background('none').$('-blur ' + this.flags.v + 'x' + this.flags.v).save();
        }
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'rotate',
    meta: {
        help: {
            description: 'Воззвращает изображение c блюром',
            sample: 'blur [image]'
        }
    },
    flags: {
        a: ['flag', true],
    },
    processClass: ImageProcess,
    async handler() {
        let data;
        data = await this.gm.background('none').$('-virtual-pixel transparent -duplicate 29 -distort SRT \'%[fx:360*t/n]\' -set delay 10 -loop 0').save();
        /*-duplicate 29  -virtual-pixel transparent -distort SRT '0,0 1, 0, %[fx:w*t/n],%[fx:h*t/n]' -set delay 10 -loop 0*/
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'magic',
    meta: {
        help: {
            description: 'Воззвращает изображение c блюром',
            sample: 'blur [image]'
        }
    },
    flags: {
        a: ['flag', false],
    },
    processClass: ImageProcess,
    async handler() {
        let data;

        data = await this.gm.background('none').$('-virtual-pixel transparent -define shepards:power=1.0 -distort Shepards').push('30,11 20,11  48,29 58,29').save();
        /*-duplicate 29  -virtual-pixel transparent -distort SRT '0,0 1, 0, %[fx:w*t/n],%[fx:h*t/n]' -set delay 10 -loop 0*/
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'polaroid',
    meta: {
        help: {
            description: 'Воззвращает изображение в стиле polaroid',
            sample: 'polaroid [image]'
        }
    },
    processClass: ImageProcess,
    async handler() {
        const data = await this.gm.background('none').$('-modulate 150,70,100 ( +clone -background #ff9966 -vignette 0x50  -channel R -level 0.3,0.7 +channel ) -average -contrast').save();
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'contrast',
    meta: {
        help: {
            description: 'Воззвращает изображение с повышенным контрастом',
            sample: 'contrast [image]'
        }
    },
    processClass: ImageProcess,
    async handler() {
        const data = await this.gm.background('none').$('-contrast -contrast -contrast').save();
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'sharpen',
    meta: {
        help: {
            description: 'Воззвращает изображение с более резкими очертаниями',
            sample: 'sharpen [image]'
        }
    },
    processClass: ImageProcess,
    async handler() {
        const data = await this.gm.background('none').$('-sharpen 0x5 -contrast').save();
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'grayscale',
    meta: {
        help: {
            description: 'Воззвращает изображение в чб',
            sample: 'grayscale [image]'
        }
    },
    processClass: ImageProcess,
    async handler() {
        const data = await this.gm.background('none').$('-colorspace Gray').save();
        this.form.update(data);
    },
}));

imagesModule.addCommand(new Command({
    name: 'monochrome',
    meta: {
        help: {
            description: 'Воззвращает изображение в чб',
            sample: 'monochrome [image]'
        }
    },
    processClass: ImageProcess,
    async handler() {
        const data = await this.gm.background('none').$(`-delay 100 -dispose None-loop 0 `).save();
        this.form.update(data);
    },
}));

let s = {};
imagesModule.addCommand(new Command({
    name: 's',
    meta: {},
    async handler() {
        s[this.message.author.id] = this.message.text;
    },
}));

imagesModule.addCommand(new Command({
    name: 'g',
    meta: {},
    async handler() {
        this.message.channel.send('`' + s[this.message.author.id] + '`');
    },
}));

imagesModule.addCommand(new Command({
    name: 'f',
    meta: {},
    processClass: ImageProcess,
    async handler() {
        const data = await this.gm.background('none').$(s[this.message.author.id]).save();
        this.form.update(data);
    },
}));

module.exports = imagesModule;