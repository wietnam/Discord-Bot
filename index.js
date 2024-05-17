const Discord = require('discord.js');
const config = require('./config.json');
const dc = require('./deploy-commands.js');
const fs = require('fs');
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildPresences
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.GuildScheduledEvent,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.ThreadMember,
        Discord.Partials.User
    ]
});

client.commands = new Discord.Collection();

for (const folder of fs.readdirSync('./commands')) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);

        client.commands.set(command.data.name, command);
    }
}

client.once('ready', () => {
    console.log('Bot discord jest online!');
    client.user.setStatus('dnd');
    client.user.setPresence({
        activities: [{ name: 'Euro Truck Simulator 2', type: Discord.ActivityType.Playing }],
        status: 'dnd'
    });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            return console.error('Nie znaleziono komendy!');
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Wystąpił błąd w komendzie!', ephemeral: true });
        }
    }


    if (interaction.isModalSubmit()) {
        const [modalName, memberId, roleId] = interaction.customId.split(':');

        if (modalName === 'euro-speed-message-modal') {
            const message = interaction.fields.getTextInputValue('espl-message');

            if (memberId !== 'none') {
                try {
                    const user = await interaction.guild.members.fetch(memberId);
                    await user.send(message);
                    return interaction.reply({ content: `Wiadomość została wysłana do użytkownika <@${memberId}>`, ephemeral: true });
                } catch (error) {
                    return interaction.reply({ content: 'Wiadomość nie mogła zostać wysłana do użytkownika ponieważ nie przyjmuje on wiadomości od nieznanych osób!', ephemeral: true });
                }
            }

            if (roleId !== 'none') {
                const role = await interaction.guild.roles.fetch(roleId);
                const membersWithRole = interaction.guild.members.cache.filter(member => member.roles.cache.has(roleId));
                membersWithRole.forEach(async member => {
                    try {
                        await member.send(message);
                    } catch (error) {
                        console.error(`Nie udało się wysłać wiadomości do ${member.user.username}: ${error}`);
                    }
                });
                return interaction.reply({ content: `Wiadomość wysłana do członków z rolą <@&${role.id}>`, ephemeral: true });
            }

            return interaction.reply({ content: 'Wystąpił błąd podczas wysyłania wiadomości.', ephemeral: true });
        }
    }
});

client.login(config.TOKEN);