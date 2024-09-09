//Consts
const dotenv = require('dotenv')
dotenv.config();

const { Client, Events, GatewayIntentBits } = require('discord.js');
const token = process.env.TOKEN

//Código de iniciação
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
],
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Iniciado! logado como ${readyClient.user.tag}`);
});

client.login(token);

