//Consts
const dotenv = require('dotenv')
dotenv.config();

const { Client, Events, GatewayIntentBits } = require('discord.js');
const env = process.env

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

client.login(env.TOKEN);

const reddit = env.reddit.split(",")

//RSS Reddit
//A base é que se voce por .rss no final de algum subrred, conseguirá o rss dele
//usa-se como ultimo o id da ultima postagem
//tentar organizar pelos melhores de um periodo de tempo (semana,)
for (var num = reddit.length-1; num != -1; num --) {
    console.log(reddit[num])
}

//criar um loop de x secundos (300?) 





//Ytdlp




//mandar para o discord




//A ideia vai ser ler o RSS a cada x segundos, caso tenha algo novo ele irá
//Pegar o link do post do reddit
//Se for video, transformar em mp4 usando alguma bosta
//embedar e mandar no discord, não sei fazer dinamicamente então o channelid e o link do reddit vai ficar no env
//baixar -> ffmpeg -> mandar -> deletar
