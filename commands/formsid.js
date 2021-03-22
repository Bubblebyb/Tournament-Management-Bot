const scripts = require('../scripts.js');
module.exports = {
    name: 'formsid',
    description: 'Sets Google Forms Spreadsheet id',
    execute(message, args, isAdmin, servers) {
        if (isAdmin) {
            if (args[0]) {
                message.channel.send('Searching for Google Sheet. If there is no success message, you have probably entered an invalid id or not shared your Sheet with the bot email. This message will be deleted shortly.').then(message => {
                    message.delete({timeout: 2000})
                });
                scripts.checkSheetId(message, args, servers);
            } else {
                message.channel.send('Please include the Google Sheets id in the command');
            }
        }
    },
};