const scripts = require('../scripts.js');
module.exports = {
    name: 'role',
    description: 'Assigns roles',
    execute(message, servers) {
        if (servers[message.guild.id].formSheetId) {
            scripts.getRoles(message, servers);
        } else {
            message.channel.send('No Google Forms Spreadsheet Id has been set for this server.');
        }
    },
};
