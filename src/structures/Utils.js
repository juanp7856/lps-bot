const { glob } = require('glob');
const { promisify } = require('util');
const proGlob = promisify(glob);

module.exports = class BotUtils{
    constructor(client){
        this.client = client;
    }

    async loadFiles(dirName){
        // console.log(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`)

        const FILES = await glob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`)

        // console.log('Archivos leidos')

        // const FILES = await proGlob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`)
        console.log(FILES)

        FILES.forEach((FILES) => delete require.cache[require.resolve(FILES)])
        return FILES;
    }
}