const fs = require('fs');
const scripts = require('../scripts.js');
module.exports = {
    name: 'teams',
    description: 'Creates Team Roles',
    execute(message, args, servers, isAdmin) {
        if (isAdmin) {
            if (args[0]) {
                if (parseInt(args[0])) {
                    if (!servers[message.guild.id].numberOfTeams) {
                        scripts.teams(message, args[0]);
                        servers[message.guild.id].numberOfTeams = args[0];
                        fs.writeFileSync('./servers.json', JSON.stringify(servers));
                        message.channel.send('Team roles set up.');
                    } else {
                        message.channel.send('Team roles for this server have already been set up, remove them first before creating new ones');
                    }
                } else if (args[0].toLowerCase() === 'rm') {
                    if (!servers[message.guild.id].numberOfTeams) {
                        message.channel.send('Generate your teams first');
                    } else {
                        scripts.deleteTeams(message, servers[message.guild.id].numberOfTeams);
                        servers[message.guild.id].numberOfTeams = null;
                        fs.writeFileSync('./servers.json', JSON.stringify(servers));
                        message.channel.send('Teams Deleted');
                    }
                } else {
                    message.channel.send('Include the number of teams to be added or do `*teams rm`');
                }
            } else {
                message.channel.send('Include the number of teams to be added or do `teams rm`');
            }
        }
    },
};