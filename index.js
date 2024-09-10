//Consts
const dotenv = require('dotenv')
dotenv.config();

const fs = require('fs')

let Parser = require('rss-parser');
let parser = new Parser({
    customFields: {
        feed: ['entry']
    }
});

const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const env = process.env

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

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
    redd();
});

client.login(env.TOKEN);

const reddit = env.reddit.split(",");

//RSS Reddit
//A base é que se voce por .rss no final de algum subrred, conseguirá o rss dele
//usa-se como ultimo o id da ultima postagem
//tentar organizar pelos melhores de um periodo de tempo (semana,)

async function redd() {
    while (true) {
        for (var num = reddit.length-1; num != -1; num --) {
            var redd = `https://www.reddit.com/r/${reddit[num]}/hot.rss`;
            var rss = await parser.parseURL(redd)
            var nen = 0
            var sub = rss.items[0].content.split("/r/")[1].split("/")[0];
            var id = []
            if (fs.existsSync(`./database/${sub}.txt`)) {
                var antigo = fs.readFileSync(`./database/${sub}.txt`).toString(); //me parece uma péssima maneira de implementar isso, dupla verificação se um arquivo existe.
            }
            for (var it = 0; it != 10; it++) {
                id.push(rss.items[it].link);
            }
            for (var it = id.length-1; it != -1; it--) {
                if (top10(sub, id[it])) {
                    var author = rss.items[it].author;
                    var title = rss.items[it].title.toString();
                    var img = rss.items[it].content.split("<span><a href=\"")[1].split("\">[link]")[0];
                    if (!rss.entry['media:thumbnail']) {
                        const embed = new EmbedBuilder()
                            .setColor(0xFF5700)
                            .setTitle(title)
                            .setURL(id[it])
                            .setAuthor({ name: `${author}`, url: `https://www.reddit.com${author}` })
                            .setThumbnail('https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png')
                            .setImage(img)
                        client.channels.cache.get(env.channelid).send({ embeds: [embed] });
                    } else {
                        console.log('foi')
                        client.channels.cache.get(env.channelid).send(`&download ${id[it]} | ${sub} | ${author} | ${title}`)
                        .then(sentMessage => {
                            setTimeout(() => {
                                sentMessage.delete();
                            }, 5000); // 5 segundos
                        })

                    }
                }        
                else {
                    nen++
                }
            }
            if (nen != 10) {
                var antigo = fs.readFileSync(`./database/${sub}.txt`).toString().split(" ",7);
                if (!antigo.includes(id))
                    fs.writeFileSync(`./database/${sub}.txt`, id.toString())
            }
        }
      await new Promise(resolve => setTimeout(resolve, 60000)); // espera por 60 segundos
      console.log('Running...');
    }
  }

function top10 (sub, id) { //escreve todos os ids do top10 em um txt
    if (fs.existsSync(`./database/${sub}.txt`)) {
        var ids = fs.readFileSync(`./database/${sub}.txt`).toString();
        if (ids.includes(id)) {
            return false;
        }
        else {
            var data = fs.readFileSync(`./database/${sub}.txt`).toString().split(" ",7);
            data.push(id);
            //console.log(data)
            fs.writeFileSync(`./database/${sub}.txt`, data.toString())
            return true
        }
    }
    else {
        fs.writeFileSync(`./database/${sub}.txt`, id)
        return true
    }
}
//esta é uma maneira burra de se fazer isso, mas funciona.


//---------ATENÇÃO---------
//são 3 etapas, checar antigos, mandar novos, deletar antigos
//acabei perdendo um pouco o rumo, preciso fazer uma variavel contendo todos os ids dos top10 post do reddit
//1 etapa: ver tudo o que tem na lista atual - OK
//2 etapa: ver como está a nova lista (atualizada) - OK
//3 etapa: manda os novos itens para o discord
//4 etapa: apagar todos os itens que não forem novos (pode ser feito apagando tudo e sobrescrevendo) - OK
//---------ATENÇÃO---------




//criar um loop de x secundos (300?) 





//Ytdlp




//mandar para o discord




//A ideia vai ser ler o RSS a cada x segundos, caso tenha algo novo ele irá
//Pegar o link do post do reddit
//Se for video, transformar em mp4 usando alguma bosta
//embedar e mandar no discord, não sei fazer dinamicamente então o channelid e o link do reddit vai ficar no env
//baixar -> ffmpeg -> mandar -> deletar