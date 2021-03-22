const fs = require('fs');
const scripts = require('../scripts.js');
module.exports = {
    name: 'template',
    description: 'Creates server template',
    execute(message, args, servers, isAdmin) {
        if (isAdmin) {
            if (!args[0]) {
                message.channel.send('Please inlclude the number of rooms and number of rounds in this format: 2x5(two rooms by five rounds)');
            } else if (args[0]) {
                if (!args[0].includes('x')) {
                    message.channel.send('Please inlclude the number of rooms and number of rounds in this format: 2x5(two rooms by five rounds)');
                } else {
                    const dimensions = args[0].trim().split('x');
                    if (dimensions[0] && dimensions[1] && parseInt(dimensions[0]) && parseInt(dimensions[1])) {
                        if (parseInt(dimensions[1]) > 20) {
                            message.channel.send('For several reasons, the max number of rooms has been set to 20');
                        }
                        if (parseInt(dimensions[1]) > 20) {
                            message.channel.send('For several reasons, the max number of rounds has been set to 20');
                        }
                        if (parseInt(dimensions[0]) < 20 && parseInt(dimensions[1]) < 20) {
                            servers[message.guild.id].rooms = dimensions[0];
                            servers[message.guild.id].rounds = dimensions[1];
                            fs.writeFileSync('./servers.json', JSON.stringify(servers));
                            scripts.template(message, dimensions);
                        }
                    } else {
                        message.channel.send('Please inlclude the number of rooms and number of rounds in this format: 2x5(two rooms by five rounds)');
                    }
                }
            }
        }
    },
}