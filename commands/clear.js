module.exports = {
    name: 'clear',
    description: 'Deletes all channels',
    execute(message, isAdmin) {
        if (isAdmin) {
            message.guild.channels.cache.forEach(channel => channel.delete());
            message.guild.channels.create('general', {
                type: 'text'
            });
        }
    },
};