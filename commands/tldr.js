module.exports = {
    name: 'tldr',
    description: 'TLDR Pages',
    usage: "[{command},--search {command}, {command} --os={os}]",
    args: true,
    execute(message, args) {
        const { exec } = require("child_process")
        const arg = args.join(' ')

        if (arg[0]){
        exec(`tldr ${arg}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            message.channel.send(`stdout: ${stdout}`)
        }); } 
        else (message.reply('You need to supply a command!'))
    }
}