const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('przypomnienie')
        .setDescription('Przypomina o konwoju')
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

        if (!member && !role) {
            return interaction.reply({ content: 'Nie wybrano ani użytkownika, ani roli do której chcesz wysłać wiadomość!', ephemeral: true });
        }
        const customId = `euro-speed-message-modal:${member ? member.id : 'none'}:${role ? role.id : 'none'}`;

        const modal = new Discord.ModalBuilder()
            .setCustomId(customId)
            .setTitle('Wprowadź dane')
            .addComponents(
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('espl-message')
                        .setLabel('Wiadomość')
                        .setPlaceholder('Wprowadź tu swoją treść wiadomości którą chcesz wysłać')
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        .setRequired(true)
                )
            );

        await interaction.showModal(modal);
    }
};
