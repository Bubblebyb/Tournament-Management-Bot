    const fs = require('fs');
    const {GoogleSpreadsheet} = require('google-spreadsheet');
    const driveConfig = require('./driveConfig.json');

    function teams(message, numberOfTeams) {
        let i;
        for (i = 1; i <= numberOfTeams; i++) {
            message.guild.roles.create({
                data: {
                    name: 'A' + i
                }
            }).catch(console.error);
            message.guild.roles.create({
                data: {
                    name: 'P' + i
                }
            }).catch(console.error);
        }
    }

    function deleteTeams(message, numberOfTeams) {
        let i;
        for (i = 1; i <= numberOfTeams; i++) {
            if (message.guild.roles.cache.find(role => role.name === 'A' + i)) {
                message.guild.roles.cache.find(role => role.name === 'A' + i).delete();
            }
            if (message.guild.roles.cache.find(role => role.name === 'P' + i)) {
                message.guild.roles.cache.find(role => role.name === 'P' + i).delete();
            }
        }
    }

    function template(message, dimensions) {
        let i;
        for (i = 1; i <= dimensions[0]; i++) {
            message.guild.channels.create('Room ' + i, {
                type: 'category'
            }).then(category => {
                category.updateOverwrite(category.guild.roles.everyone, {VIEW_CHANNEL: false});
                message.guild.channels.create(category.name + ' Waiting Room', {
                    type: 'voice'
                }).then(channel => {
                    channel.setParent(category.id).then(channel => {
                    });
                    channel.updateOverwrite(channel.guild.roles.everyone, {VIEW_CHANNEL: true});
                }).catch(console.error);
                message.guild.channels.create(category.name, {
                    type: 'voice'
                }).then(channel => {
                    channel.setParent(category.id);
                }).catch(console.error);
                let j
                for (j = 1; j <= dimensions[1]; j++) {
                    message.guild.channels.create('Round ' + j, {
                        type: 'text'
                    }).then(channel => {
                        channel.setParent(category.id);
                    }).catch(console.error);
                }
            }).catch(console.error);
        }
    }

    async function checkSheetId(message, args, servers) {
        servers[message.guild.id].formSheetId = null;
        const doc = new GoogleSpreadsheet(args[0]);
        await doc.useServiceAccountAuth(require('./driveConfig.json'));
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        if (rows[0]["Team Name"] && rows[0]["Full Discord Username"] && rows[0]["First Name"]) {
            servers[message.guild.id].formSheetId = args[0];
            fs.writeFileSync('./servers.json', JSON.stringify(servers));
            message.channel.send('Successfully added Google Sheet for Google Form.');
        } else {
            message.channel.send("This Google Sheet is not a valid Google Forms Sheet. Make sure you've sent in a filler response to the Google Form. If this problem persists, create a new spreadsheet from your Google Form.")
        }
    }

    async function getRoles(message, servers) {
        const doc = new GoogleSpreadsheet(servers[message.guild.id].formSheetId);
        await doc.useServiceAccountAuth(require('./driveConfig.json'));
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        rows.forEach(row => {
            row["Full Discord Username"] = row["Full Discord Username"].replace(/ #/g, '#').replace(/# /g, '#');
            if (row["Full Discord Username"] === message.author.username + '#' + message.author.discriminator) {
                if (message.guild.roles.cache.find(r => r.name === row["Team Name"])) {
                    message.guild.members.cache.get(message.author.id).roles.add(message.guild.roles.cache.find(r => r.name === row["Team Name"])).catch(err => {
                        message.channel.send(err.toString());
                    });
                } else {
                    message.channel.send("Role " + row["Team Name"] + " does not exist.");
                }
                message.member.setNickname(row["First Name"] + " [" + row["Team Name"] + "]").catch(err => {
                    message.channel.send(err.toString());
                });
                if (message.guild.roles.cache.find(r => r.name === row["Pronouns"])) {
                    message.guild.members.cache.get(message.author.id).roles.add(message.guild.roles.cache.find(r => r.name === row["Pronouns"])).catch(err => {
                        message.channel.send(err.toString());
                    });
                } else {
                    message.guild.roles.create({
                        data: {
                            name: row["Pronouns"]
                        }
                    }).then(role => {
                        message.guild.members.cache.get(message.author.id).roles.add(role).catch(err => {
                            message.channel.send(err.toString());
                        });
                    }).catch(err => {
                        message.channel.send(err.toString());
                    });
                }
                message.channel.send('Roles and nickname added.');
            }
        });
    }

    module.exports = {teams, deleteTeams, template, checkSheetId, getRoles}
