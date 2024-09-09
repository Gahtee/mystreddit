//Consts
const dotenv = require('dotenv')
dotenv.config();

const fs = require('fs')

let Parser = require('rss-parser');
let parser = new Parser();

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

//client.login(env.TOKEN);

const reddit = env.reddit.split(",");

//RSS Reddit
//A base é que se voce por .rss no final de algum subrred, conseguirá o rss dele
//usa-se como ultimo o id da ultima postagem
//tentar organizar pelos melhores de um periodo de tempo (semana,)

/*
(async () => {
for (var num = reddit.length-1; num != -1; num --) {
    var redd = `https://www.reddit.com/r/${reddit[num]}/top.rss?t=day`
    var rss = await parser.parseURL(redd);
    for (var it = 0; it != 10; it++) {
        console.log(rss.items[it]) //melhorar isso
    }

}
})();
*/

(async () => {
    var redd = `https://www.reddit.com/r/${reddit[0]}/top.rss?t=day`
    var rss = await parser.parseURL(redd);
    //for (var it = 0; it != 10; it++) {
        var sub = rss.items[0].content.split("/")[4];
        var id = rss.items[0].content.split("/")[6]; //melhorar isso; lembrar de alterar o 0 por it
        
        //criação do json
        fs.open(`./database/${sub}`,'w', function (err, file){});
        fs.readFile(`./database/${sub}`, function(err, data){
            var includes = data
            return includes
        });
        if (rnd(sub,id)) {
            console.log("penis")
        }
        else {
            fs.writeFile()
        };
        console.log(id,sub);
   // }

})();

function rnd (sub, id) {
    fs.open(`./database/${sub}`,'w', function (err, file){});
    const data = fs.readFileSync(`./database/${sub}`, 'utf8');
    if (data.includes(id)) {
        return true;
    }
    else {
        return false;
    }
}

//---------ATENÇÃO---------
//são 3 etapas, checar antigos, mandar novos, deletar antigos
//acabei perdendo um pouco o rumo, preciso fazer uma variavel contendo todos os ids dos top10 post do reddit
//1 etapa: ver tudo o que tem na lista atual
//2 etapa: ver como está a nova lista (atualizada)
//3 etapa: manda os novos itens para o discord
//4 etapa: apagar todos os itens que não forem novos (pode ser feito apagando tudo e sobrescrevendo)
//---------ATENÇÃO---------




//criar um loop de x secundos (300?) 





//Ytdlp




//mandar para o discord




//A ideia vai ser ler o RSS a cada x segundos, caso tenha algo novo ele irá
//Pegar o link do post do reddit
//Se for video, transformar em mp4 usando alguma bosta
//embedar e mandar no discord, não sei fazer dinamicamente então o channelid e o link do reddit vai ficar no env
//baixar -> ffmpeg -> mandar -> deletar
