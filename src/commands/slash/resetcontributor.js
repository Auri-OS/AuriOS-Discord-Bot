const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const config = require('../../../config/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contributor-reset')
        .setDescription('Remove your contributor role'),
    execute: async (interaction) => {
        const contributorRole = interaction.guild.roles.cache.get(config.roles.contributor);

        if (!contributorRole) {
            await interaction.reply({
                content: '❌ Contributor role not found in the server.',
                flags: 64
            });
            return;
        }

        if (!interaction.member.roles.cache.has(contributorRole.id)) {
            await interaction.reply({
                content: `❌ You do not have the contributor role.`,
                flags: 64
            });
            return;
        }

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm-reset')
            .setLabel('Yes, remove it')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel-reset')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

        const confirmEmbed = new EmbedBuilder()
            .setColor('#ff9800')
            .setTitle('⚠️ Confirm Reset')
            .setDescription('Are you sure you want to remove your contributor role?')
            .setFooter({ text: 'This action cannot be undone' });

        await interaction.reply({
            embeds: [confirmEmbed],
            components: [row],
            flags: 64
        });
    },
};
