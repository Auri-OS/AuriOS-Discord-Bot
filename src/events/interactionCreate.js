const { EmbedBuilder } = require('discord.js');
const config = require('../../config/config.json');

async function checkGitHubContributor(username) {
    try {
        let allContributors = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(`https://api.github.com/repos/Auri-OS/AuriOS/contributors?per_page=100&page=${page}`);
            if (!response.ok) throw new Error('Failed to fetch contributors');
            
            const contributors = await response.json();
            if (contributors.length === 0) {
                hasMore = false;
            } else {
                allContributors = allContributors.concat(contributors);
                page++;
            }
        }

        return allContributors.some(contributor => 
            contributor.login.toLowerCase() === username.toLowerCase()
        );
    } catch (error) {
        console.error('Error checking GitHub contributor:', error);
        return false;
    }
}

function extractUsername(input) {
    if (input.includes('github.com/')) {
        return input.split('github.com/')[1].split('/')[0];
    }
    return input.trim();
}

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        if (interaction.isButton()) {
            if (interaction.customId === 'confirm-reset') {
                const contributorRole = interaction.guild.roles.cache.get(config.roles.contributor);

                if (!contributorRole) {
                    await interaction.reply({
                        content: '❌ Contributor role not found in the server.',
                        flags: 64
                    });
                    return;
                }

                try {
                    await interaction.member.roles.remove(contributorRole);

                    const logChann = interaction.guild.channels.cache.find(
                        chnl => chnl.id === config.channels.logs
                    );

                    const resetEmbed = new EmbedBuilder()
                        .setColor('#ff9800')
                        .setTitle('🔄 Contributor Role Removed')
                        .setDescription(`<@${interaction.user.id}> has removed their contributor role.`)
                        .addFields(
                            { name: 'User', value: `${interaction.user.tag} (${interaction.user.id})` }
                        )
                        .setTimestamp();

                    await logChann.send({ embeds: [resetEmbed] });
                    await interaction.update({
                        content: '✅ Your contributor role has been removed.',
                        components: [],
                        embeds: []
                    });
                } catch (error) {
                    console.error('Error removing role:', error);
                    await interaction.reply({
                        content: '❌ An error occurred while removing the role. Please contact an admin.',
                        flags: 64
                    });
                }
            } else if (interaction.customId === 'cancel-reset') {
                await interaction.update({
                    content: '❌ Cancelled.',
                    components: [],
                    embeds: []
                });
            }
            return;
        }

        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === 'contributorModal') {
            await interaction.deferReply({ flags: 64 });

            const githubInput = interaction.fields.getTextInputValue('githubLink');
            const username = extractUsername(githubInput);

            const isContributor = await checkGitHubContributor(username);

            const logChann = interaction.guild.channels.cache.find(
                chnl => chnl.id === config.channels.logs
            );

            if (isContributor) {
                try {
                    const role = interaction.guild.roles.cache.get(config.roles.contributor);
                    if (!role) {
                        await interaction.editReply({
                            content: '❌ Contributor role not found in the server.'
                        });
                        return;
                    }

                    await interaction.member.roles.add(role);

                    const successEmbed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('✅ Contributor Role Added!')
                        .setDescription(`<@${interaction.user.id}> has been verified as a contributor to **AuriOS**`)
                        .addFields(
                            { name: 'GitHub Username', value: username },
                            { name: 'Discord User', value: `<@${interaction.user.id}>` }
                        )
                        .setTimestamp();

                    await logChann.send({ embeds: [successEmbed] });
                    await interaction.editReply({
                        content: `✅ Welcome to the contributors! The **Contributor** role has been added to your account.`
                    });
                } catch (error) {
                    console.error('Error adding role:', error);
                    await interaction.editReply({
                        content: '❌ An error occurred while adding the role. Please contact an admin.'
                    });
                    await logChann.send(`❌ Error adding contributor role to <@${interaction.user.id}> (${username}): ${error.message}`);
                }
            } else {
                const failEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Not a Contributor')
                    .setDescription(`<@${interaction.user.id}> is not listed as a contributor to **AuriOS**`)
                    .addFields(
                        { name: 'GitHub Username', value: username },
                        { name: 'Repository', value: 'https://github.com/Auri-OS/AuriOS' }
                    )
                    .setTimestamp();

                await logChann.send({ embeds: [failEmbed] });
                await interaction.editReply({
                    content: `❌ The GitHub username **${username}** is not found as a contributor to the AuriOS repository. If you believe this is an error, please contact an admin.`
                });
            }
        }
    }
};
