const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const commands = [];

for (const folder of fs.readdirSync('./commands')) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);

        commands.push(command.data.toJSON());
    }
}

const rest = new Discord.REST({ version: '10' }).setToken(config.TOKEN);

(async () => {
    try {
        console.log('Rozpoczęto aktualizację komend!');
        const data = await rest.put(Discord.Routes.applicationCommands(config.CLIENT_ID), { body: commands });
        console.log('Zaktualizowano komendy!');
    } catch (error) {
        console.error(error);
    }
})();