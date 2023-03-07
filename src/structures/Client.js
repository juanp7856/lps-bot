const {Client, Partials, ActivityType, PresenceUpdateStatus, Collection} = require('discord.js')
const BotUtils = require('./Utils')

module.exports = class extends Client{
    constructor(options = {
        intents: [131071],
        partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
        // allowedMentions: {
        //     parse: ["roles", "users"],
        //     repliedUser: false
        // },
        presence: {
            activities: [{name: process.env.STATUS, type: ActivityType[process.env.STATUS_TYPE]}],
            status: PresenceUpdateStatus.DoNotDisturb
        },
    }) {
        super({
            ...options
        })

        this.commands = new Collection()
        this.slashCommands = new Collection()
        this.slashArray = []
        this.utils = new BotUtils(this);

        this.startBot()
    }

    async startBot(){
        await this.loadHandlers()
        await this.loadEvents()
        await this.loadCommands()
        await this.loadSlashCommands()

        this.login(process.env.token)
    }

    async loadCommands(){
        console.log(`(${process.env.PREFIX}) Loading Commands`.blue)
        await this.commands.clear()

        const FILES_ROUTE = await this.utils.loadFiles("/src/commands")

        if(FILES_ROUTE.length){
            FILES_ROUTE.forEach((route) => {
                try {
                    const COMMAND = require(route);
                    const COMMAND_NAME = route.split("\\").pop().split("/").pop().split(".")[0]
                    COMMAND.NAME = COMMAND_NAME 

                    if(COMMAND_NAME) this.commands.set(COMMAND_NAME, COMMAND)
                } catch (err) {
                    console.log(`ERROR AL CARGAR EL ARCHIVO ${route}`.bgRed)
                    console.log(err)
                }
            })
        }

        console.log(`(${process.env.PREFIX}) ${this.commands.size} Commands Loaded`.yellow)
    }

    async loadSlashCommands(){
        console.log(`(${process.env.PREFIX}) Loading Commands`.blue)
        await this.slashCommands.clear()
        this.slashArray = []

        const FILES_ROUTE = await this.utils.loadFiles("/src/slashCommands")

        if(FILES_ROUTE.length){
            FILES_ROUTE.forEach((route) => {
                try {
                    const COMMAND = require(route);
                    const COMMAND_NAME = route.split("\\").pop().split("/").pop().split(".")[0]
                    COMMAND.CMD.name = COMMAND_NAME 

                    if(COMMAND_NAME) this.slashCommands.set(COMMAND_NAME, COMMAND)
                
                    this.slashArray.push(COMMAND.CMD.toJSON())
                } catch (err) {
                    console.log(`ERROR AL CARGAR EL ARCHIVO ${route}`.bgRed)
                    console.log(err)
                }
            })
        }

        console.log(`(${process.env.PREFIX}) ${this.slashCommands.size} Commands Loaded`.yellow)
        
        if(this?.application?.commands){
            this.application.commands.set(this.slashArray)
            console.log(`(${process.env.PREFIX}) ${this.slashCommands.size} Commands Published`.yellow)
        }
    }

    async loadHandlers(){
        console.log(`(${process.env.PREFIX}) Loading Handlers`.blue)

        const FILES_ROUTE = await this.utils.loadFiles("src/handlers")

        if(FILES_ROUTE.length){
            FILES_ROUTE.forEach((route) => {
                try {
                    require(route)(this)
                } catch (err) {
                    console.log(`ERROR AL CARGAR EL ARCHIVO ${route}`.bgRed)
                    console.log(err)
                }
            })
        }

        console.log(`(${process.env.PREFIX}) ${FILES_ROUTE.length} Handlers Loaded`.yellow)
    }

    async loadEvents(){
        console.log(`(${process.env.PREFIX}) Loading Events`.blue)

        const FILES_ROUTE = await this.utils.loadFiles("/src/events")
        this.removeAllListeners()

        if(FILES_ROUTE.length){
            FILES_ROUTE.forEach((route) => {
                try {
                    const EVENT = require(route);
                    const EVENT_NAME = route.split("\\").pop().split("/").pop().split(".")[0]
                    this.on(EVENT_NAME, EVENT.bind(null, this))

                } catch (err) {
                    console.log(`ERROR AL CARGAR EL ARCHIVO ${route}`.bgRed)
                    console.log(err)
                }
            })
        }

        console.log(`(${process.env.PREFIX}) ${FILES_ROUTE.length} Events Loaded`.yellow)
    }
}