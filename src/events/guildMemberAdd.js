const { EmbedBuilder } = require('discord.js')
const config = require('../../config/config.json')

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member, client) {
        const channel = member.guild.channels.cache.find(chnl => chnl.id === config.channels.welcome);
        const logChann = member.guild.channels.cache.find(chnl => chnl.id === config.channels.logs);

        if (!channel) {
            console.error('Welcome channel not found');
            return;
        }

        if (!logChann) {
            console.error('Log channel not found');
            return;
        }

        const Welcome = new EmbedBuilder()
            .setColor('#5c87dd')
            .setTitle('Oh a new visitor !')
            .setDescription(`👋 Welcome to the server ${member} !` )
            .setThumbnail('https://raw.githubusercontent.com/Auri-OS/auri-os.github.io/refs/heads/main/Logo.png')
            
        channel.send(`Please read the rules in <#${config.channels.rules}> before participating.`);
            
        channel.send({ embeds: [Welcome] });

        const roleId = config.roles.visitors;
        try {
            await member.roles.add(roleId);
            logChann.send(`Role <@&${roleId}> added to <@${member.user.id}>`);
        } catch (error) {
            console.error(error);
            logChann.send(`Role <@&${roleId}> not added to <@${member.user.id}> due to error, please check the logs`);
        }        
    },
};