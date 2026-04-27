const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const config = require('../../../config/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('socials')
        .setDescription("Show AuriOS's social links"),
    execute: async (interaction) => {

        const aurios_socials = new EmbedBuilder()
            .setColor('#5c87dd')
            .setTitle('My Website')
            .addFields(
                { name: "Official's WebSite", value: "https://auri-os.org/" },
                { name: "Github", value: "https://github.com/Auri-OS/AuriOS" },
                { name: "LinkedIn", value: "https://www.linkedin.com/company/auri-os/" },
                { name: "OpenSource-Together", value: "https://opensource-together.com/projects/pjt_7f7721abb984408598ee7991497956d2" }
                )
                .setThumbnail(config.client.picture)
                .setTimestamp()
                .setFooter({ text: `By ${config.client.username}`, iconURL:`${config.client.picture}` });

        interaction.reply({ embeds: [aurios_socials], flags: 64 });
    },
};