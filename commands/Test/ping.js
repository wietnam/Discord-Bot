const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong'),

    async execute(interaction) {
        interaction.reply({content: 'Pong!', ephemeral: true});
    }
}
