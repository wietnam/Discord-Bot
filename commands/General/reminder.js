const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('przypomnienie')
        .setDescription('Przypomina o konwoju')
        //.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('osoba')
                .setDescription('Wybierz osobę do której chcesz wysłać wiadomość')
                .setRequired(false)
        )
        .addRoleOption(option => option
            .setName('rola')
            .setDescription('Wybierz rolę do której chcesz wysłać przypomnienie')
            .setRequired(false)
        ),

    async execute(interaction) {
        const member = interaction.options.getUser('osoba');
        const role = interaction.options.getRole('rola');

        if (message && !member && !role) {
            return interaction.reply({ content: 'Nie wybrano ani użytkownika, ani roli do której chcesz wysłać wiadomość!', ephemeral: true });
        }

        if (message && member) {
            const user = await interaction.guild.members.fetch(member.id);

            if (user) {
                try {
                    await user.send(message);
                } catch (error) {
                    interaction.reply({ content: 'Wiadomość nie mogła zostać wysłana do użytkownika ponieważ nie przyjmuje on wiadomości od nieznanych osób!', ephemeral: true });
                }
                return interaction.reply({ content: `Wiadomość została wysłana do użytkownika <@${member.id}>`, ephemeral: true });
            } else {
                return interaction.reply({ content: 'Nie znaleziono użytkownika na serverze!', ephemeral: true });
            }
        } else if (message && role) {
            const membersWithRole = interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id));
            membersWithRole.forEach(async member => {
                try {
                    await member.send(message);
                } catch (error) {
                    console.error(`Nie udało się wysłać wiadomości do ${member.user.tag}: ${error}`);
                }
            });
            return interaction.reply({ content: `Wiadomość wysłana do członków z rolą ${role.name}`, ephemeral: true });

            return interaction.reply({ content: 'Wystąpił błąd podczas wysyłania wiadomości.', ephemeral: true });
        }
    }
}
