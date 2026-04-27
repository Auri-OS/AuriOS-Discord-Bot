const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from the channel')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Number of messages to clear')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Optional: clear messages only from this user')
                .setRequired(false)
        ),
    execute: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.reply({
                content: '❌ You do not have permission to use this command.',
                flags: 64
            });
            return;
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.reply({
                content: '❌ I do not have permission to delete messages.',
                flags: 64
            });
            return;
        }

        const amount = interaction.options.getInteger('amount');
        const targetUser = interaction.options.getUser('user');

        try {
            await interaction.deferReply({ flags: 64 });

            let messages = await interaction.channel.messages.fetch({ limit: 100 });

            if (targetUser) {
                messages = messages.filter(msg => msg.author.id === targetUser.id).first(amount);
            } else {
                messages = messages.first(amount);
            }

            if (messages.length === 0) {
                await interaction.editReply({
                    content: `❌ No messages to delete.`
                });
                return;
            }

            await interaction.channel.bulkDelete(messages, true);

            const clearEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🗑️ Messages Cleared')
                .setDescription(`${messages.length} message(s) have been deleted.`)
                .addFields(
                    { name: 'Channel', value: `<#${interaction.channel.id}>` },
                    { name: 'Cleared by', value: `<@${interaction.user.id}>` },
                    { name: 'Target', value: targetUser ? `<@${targetUser.id}>` : 'All users' }
                )
                .setTimestamp();

            await interaction.editReply({
                content: `✅ Successfully deleted ${messages.length} message(s).`
            });

            const logChann = interaction.guild.channels.cache.find(
                chnl => chnl.id === config.channels.logs
            );

            if (logChann) {
                await logChann.send({ embeds: [clearEmbed] });
            }
        } catch (error) {
            console.error('Error clearing messages:', error);
            await interaction.editReply({
                content: '❌ An error occurred while clearing messages. Please contact an admin.'
            });
        }
    },
};
