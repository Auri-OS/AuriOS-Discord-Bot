const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { EmbedBuilder, TextInputStyle } = require('discord.js')
const config = require('../../../config/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contributor')
        .setDescription('Link your GitHub account if you are a contributor to AuriOS'),
    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('contributorModal')
            .setTitle('Verify as AuriOS Contributor');

        const githubLinkInput = new TextInputBuilder()
            .setCustomId('githubLink')
            .setLabel('Enter your GitHub profile or link')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('e.g., https://github.com/username or username')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(githubLinkInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },
};
