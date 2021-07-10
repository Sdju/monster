const gm = require('./gm-mixes');
const afs = require('fs').promises;
const path = require('path');

const download = require('./download-image');
const getImageUrl = require('./get-image-url');
const Process = require('../../classes/Process');

const preloader = process.env.M_IMAGES_PRELOADER;
const uploadChannelId = process.env.M_IMAGES_CHANNEL_ID;
function imageRender({ url, author, preload }) {
    if (preload) {
        return {
            title: 'Изображение обрабатывается',
            image: {url: preloader},
            footer: {
                text: author.username,
                icon_url: author.avatarURL
            },
        }
    }
    return {
        title: 'Результат обработки:',
        image: {url: url},
        footer: {
            text: author.username,
            icon_url: author.avatarURL
        },
    }
}

class ImageProcess extends Process {
    async run() {
        const img = getImageUrl(this.message);
        if (img === null) {
            this.error({title: 'некорректные параметры', description: 'Необходимо изображение для обработки!'});
            return;
        }
        this.flags = this.getFlags();
        this.getImgData(img, this.message, this.flags.a);
        await download(img.url, this.downloadFilename);
        try {
            this.form = await this.answer({preload: true, author: this.message.author});
            this.form.data.preload = false;
            await super.run();
        } catch(e) {
            console.error(e);
        }
        this.gm.free();
    }

    async answer(props, render = imageRender) {
        return super.answer(props, render)
    }

    getImgData(img, message, gif = false) {
        const spName = img.name.split('.');
        this.ext = spName[spName.length - 1];
        this.extOut = (gif || (this.ext === 'gif'))? 'gif' : ((['jpg', 'jpeg', 'png'].includes(this.ext))? this.ext : 'png');
        this.nameOut = (this.ext === this.extOut)? img.name : (spName.slice(0, spName.length - 1).join('') + `.${this.extOut}`);
        const pathToIm = path.join(__dirname, '..', '..', '..', 'im');
        this.downloadFilename = path.join(pathToIm, `d-${message.id}.${this.ext}`);
        this.editFilename =  path.join(pathToIm, `e-${message.id}.${this.extOut}`);
        let self = this;
        let temps = [];
        let newGm = {
            save() {
                return new Promise((res, rej)=> {
                    this.write(self.editFilename, (err)=> {
                        if(err) {
                            console.log(err);
                            rej(err);
                        }
                        self.message.client.channels.cache.get(uploadChannelId).send({
                            files: [{
                                attachment: self.editFilename,
                                name: self.nameOut
                            }]
                        }).then((msg)=> {
                            res({
                                url: msg.attachments.first().url,
                                author: message.author,
                            });
                        });
                    });
                });
            },
            free() {
                afs.unlink(self.downloadFilename);
                afs.unlink(self.editFilename);
            },
            tmp(ext, source) {
                const name = `t-${message.id}-${temps.length + 1}.${ext}`;
                temps.push(name);
                const tmpGm = gm(source);
                tmpGm.save = ()=> {
                    return new Promise((res, rej)=> {
                        this.write(self.editFilename, (err)=> {
                            if(err) {
                                console.log(err);
                                rej(err);
                            }
                            res(name)
                        });
                    });
                };
                tmpGm.fmt = ()=> {
                    return new Promise((res, rej)=> {

                    })
                };
                return tmpGm;
            }
        };
        newGm.__proto__ = gm(this.downloadFilename);
        this.gm = newGm;
    }
}


module.exports = ImageProcess;
