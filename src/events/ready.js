module.exports = client => {
    console.log(`Sesión iniciada como ${client.user.tag}`)

    if(client?.application?.commands){
        client.application.commands.set(client.slashArray)
        console.log(`(${process.env.PREFIX}) ${client.slashCommands.size} Commands Published`.yellow)
    }
}