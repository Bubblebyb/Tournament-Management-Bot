const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

const {GoogleSpreadsheet} = require('google-spreadsheet');
const driveConfig = require('./driveConfig.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

let servers = JSON.parse(fs.readFileSync('./servers.json'));

client.on('ready', () => {
    console.log('Bot Started');
});

client.on('message', message => {
    const isAdmin = message.member.hasPermission("ADMINISTRATOR");
    const prefix = '*'
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = message.content.split("")[0] + args.shift().toLowerCase();
    if (message.channel.guild) {
        if (!servers[message.guild.id]) {
            servers[message.guild.id] = {};
            servers[message.guild.id].name = message.guild.name;
            fs.writeFileSync('./servers.json', JSON.stringify(servers));
        }
        switch (command) {
            case '*role':
                client.commands.get('role').execute(message, servers);
                break;
            case '*clear':
                client.commands.get('clear').execute(message, isAdmin);
                break;
            case '*email':
                message.channel.send("This bot's service email is " + driveConfig.client_email);
                break;
            case '*formsid':
                client.commands.get('formsid').execute(message, args, isAdmin, servers);
                break
            case '*teams':
                client.commands.get('teams').execute(message, args, servers, isAdmin);
                break;
            case '*template':
                client.commands.get('template').execute(message, args, servers, isAdmin);
        }
    }
});
client.login('discord Key');