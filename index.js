const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const CommandDeployer = require('./deploy-commands')
const Cache = require('js-object-cache')
const { token, bot, message_rewards } = require('./config');
const { variable_probability } = require('./lib/misc');

const MessageCache = new Cache();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

//commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}


// When the client is ready, run this code (only once)
client.once('ready', async () => {
    if (process.env.LOAD_SLASH_COMMANDS.toLowerCase() === 'true') {
        CommandDeployer.setClient(client)
        await CommandDeployer.loadCommands()
        await CommandDeployer.setPermissions()
    }

    client.user.setActivity(bot.activity_message, { type: bot.activity });
    client.user.setStatus(bot.activity_status);

    console.log('Ready!');
});

client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (message.guild) {
        if (message_rewards.enabled && message.content.length > 0) {
            if (!MessageCache.has(`${message.guild.name}.${message.author.username}`)) {
                MessageCache.set(`${message.guild.name}.${message.author.username}`, 0);
            }
            MessageCache.set(`${message.guild.name}.${message.author.username}`, MessageCache.get(`${message.guild.name}.${message.author.username}`) + 1);
            const getCoins = variable_probability(message_rewards.probability, MessageCache.get(`${message.guild.name}.${message.author.username}`), message_rewards.jump_at, message_rewards.credits_per_100_messages)
            console.log(`[${MessageCache.get(`${message.guild.name}.${message.author.username}`)} - ${getCoins}][${message.guild.name}] ${message.author.username}: ${message.content}`);
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Login to Discord with your client's token
client.login(token);