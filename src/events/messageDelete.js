const { EmbedBuilder } = require('discord.js')
const config = require('../../config/config.json')

module.exports = {
    name: 'messageDelete',
    once: false,
    async execute(message) {
        // Ignore messages from git_feed category
        if (message.channel.parentId === config.categories.git_feed) {
            return;
        }
        
        function deleteMsg() {
            const logChann = message.guild.channels.cache.get(config.channels.logs);

            const logMsg = new EmbedBuilder()
                .setColor(0xf54242)
                .setTitle("Deleted Message")
                .addFields(
                    { name: " ", value: " " },
                    { name: 'From user:', value: `${message.author}`, inline: true },
                    { name: 'In:', value: `#${message.channel.name}`, inline: true },
                    { name: " ", value: " " },
                    { name: " ", value: " " },
                    { name: 'Content', value: `${message.content}` },
                    { name: " ", value: " " },
                )
                .setThumbnail("https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".jpeg")
                .setTimestamp()
                .setFooter({ text: `by ${config.client.username}`, iconURL: `${config.client.picture}` });

            if(message.author.id == config.client.id) {
                return;
            }
            else{
                logChann.send({ embeds: [logMsg] });
            }
        }
        deleteMsg();
    }
};