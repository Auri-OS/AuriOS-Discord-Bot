const { EmbedBuilder } = require('discord.js');
const config = require('../../config/config.json')

module.exports = {
	name: "messageUpdate",
	once: false, 
	async execute(oldMessage, newMessage, message, client) {
        if (oldMessage.channel.parentId === config.categories.git_feed) {
            return;
        }
        
    function updateMsg() {
		const logChann = oldMessage.guild.channels.cache.get(config.channels.logs);

		const logMsg = new EmbedBuilder()
        .setColor(0xffe100)
        .setTitle("Updated Message")
        .addFields(
			{ name: " ", value: " " },
			{ name: "From User:", value: `${oldMessage.author}`, inline: true },
			{ name: "In :", value: `#${oldMessage.channel.name}`, inline: true },
			{ name: " ", value: " " },
			{ name: " ", value: " " },
			{ name: "Old Content", value: `${oldMessage.content}` },
			{ name: "New Content", value: `${newMessage.content}` },
			{ name: " ", value: " " }
        )
        .setThumbnail("https://cdn.discordapp.com/avatars/"+ oldMessage.author.id+"/"+ oldMessage.author.avatar+".jpeg")
        .setTimestamp()
        .setFooter({ text: `by ${config.client.username}`, iconURL: `${config.client.picture}` });

		if(oldMessage.author.id == config.client.id) {
            return;
        }
        else{
			logChann.send({ embeds: [logMsg] });
        }
    }

    updateMsg();
	},
};