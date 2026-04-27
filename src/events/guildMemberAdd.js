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
            .setDescription(`Welcome to the server ${member} !` )
            .setImage('https://private-user-images.githubusercontent.com/146101928/498057247-d0ea421c-566b-4903-bafe-aada8be89fb0.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzcyOTY0MTQsIm5iZiI6MTc3NzI5NjExNCwicGF0aCI6Ii8xNDYxMDE5MjgvNDk4MDU3MjQ3LWQwZWE0MjFjLTU2NmItNDkwMy1iYWZlLWFhZGE4YmU4OWZiMC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwNDI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQyN1QxMzIxNTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT05YmMzMzEyZGY4ZTNjMGI5NzVkOWNmYjYyZGE5ZmRkYjQzNjlmNmYxNzkzM2ZkMzNkZjdmZjJmNjc2YWM3ZmZhJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9aW1hZ2UlMkZwbmcifQ.pYMvL1q3tx80VmBXfPObYS7PI6hTD6Y6hv33RV-uwS4')
            
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