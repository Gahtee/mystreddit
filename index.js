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

const { Client, Events, GatewayIntentBits, EmbedBuilder, TextInputBuilder } = require('discord.js');
const env = process.env

//Código de iniciação
const client = new Client({
    intents: [
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

client.login(env.token);

const reddit = env.reddit.split(",");

//RSS Reddit
//A base é que se voce por .rss no final de algum subrred, conseguirá o rss dele
//usa-se como ultimo o id da ultima postagem

async function redd() {
    try {
        while (true) {
            for (var num = reddit.length - 1; num != -1; num--) {
                var redd = `https://www.reddit.com/r/${reddit[num]}/hot.rss`;
                await new Promise(resolve => setTimeout(resolve, 600000))
                var rss = await parser.parseURL(redd)
                var nen = 0
                var sub = rss.items[0].content.split("/r/")[1].split("/")[0];
                var id = []
                if (fs.existsSync(`./database/${sub}.txt`)) {
                    var antigo = fs.readFileSync(`./database/${sub}.txt`).toString(); //me parece uma péssima maneira de implementar isso, dupla verificação se um arquivo existe.
                } else {
                    fs.openSync(`./database/${sub}.txt`, 'w+')
                }
                for (var it = 0; it != 10; it++) {
                    id.push(rss.items[it].link);
                }
                for (var it = id.length - 1; it != -1; it--) {
                    if (top10(sub, id[it])) {
                        var links = rss.items[it].content.split("<span><a href=\"https://")[1].split("/")[0]
                        if (!rss.items[it].content.includes('src') && links != "v.redd.it" && links != "i.redd.it") {
                            nen++
                        } else {
                            var author = rss.items[it].author;
                            var titleb = rss.items[it].title.toString();
                            if (titleb.length >= 255) {
                                var title = title.match(/.{1,255}(?:\s|$)/g)[0];
                            } else {
                                var title = titleb
                            }
                            if (rss.items[it].content.split("<span><a href=\"https://")[1].split("/")[0] != "v.redd.it") {
                                var img = rss.items[it].content.split("<span><a href=\"")[1].split("\">[link]")[0];
                                const embed = new EmbedBuilder()
                                    .setColor(0xFF5700)
                                    .setTitle(title)
                                    .setURL(id[it])
                                    .setAuthor({ name: `${author}`, url: `https://www.reddit.com${author}` })
                                    .setThumbnail('https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png')
                                    .setImage(img)
                                client.channels.cache.get(env.channelid).send({ embeds: [embed] });
                            } else {
                                client.channels.cache.get(env.channelid).send(`&download ${id[it]} | ${sub} | ${author} | ${title}`)
                                    .then(sentMessage => {
                                        setTimeout(() => {
                                            sentMessage.delete();
                                        }, 5000); // 5 segundos
                                    })

                            }
                        }
                    }
                    else {
                        nen++
                    }
                }
                if (nen != 10) {
                    var antigo = fs.readFileSync(`./database/${sub}.txt`).toString().split(" ", 7);
                    if (!antigo.includes(id))
                        fs.writeFileSync(`./database/${sub}.txt`, id.toString())
                }
            }
            console.log('Rodando...');
        }
    } catch (e) {
        console.log(e)
    }
}
function top10(sub, id) { //escreve todos os ids do top10 em um txt
    if (fs.existsSync(`./database/${sub}.txt`)) {
        var ids = fs.readFileSync(`./database/${sub}.txt`).toString();
        if (ids.includes(id)) {
            return false;
        }
        else {
            var data = fs.readFileSync(`./database/${sub}.txt`).toString().split(" ", 7);
            data.push(id);
            fs.writeFileSync(`./database/${sub}.txt`, data.toString())
            return true
        }
    }
    else {
        fs.writeFileSync(`./database/${sub}.txt`, id)
        return true
    }

} //Parece existir maneiras melhores de fazer isso.
