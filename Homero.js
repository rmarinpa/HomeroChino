const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const Token = "NDMxMzA2MTI0MjAxOTUxMjM1.DudmkA.8qnD_8V7ktD8okDitevAhNgpfv8";

const Prefix = "!";

function play(connection,message){
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if(server.queue[0]) play(connection, message);

        else connection.disconnect();
    });
}

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function(){
    console.log("Conexión exitosa");
});


bot.on("message", function (message){
    if(message.author.equals(bot.user)) return;

    if(!message.content.startsWith(Prefix)) return ;

    var args = message.content.substring(Prefix.length).split(" ");

    switch (args[0].toLowerCase()){
        case "info":
            message.channel.sendMessage("Soy Homero, pero Chino");
            break;

        case "ayuda":
            var embed = new Discord.RichEmbed()
            .addField("Comandos para usar: " , "!info , !ayuda, !play", true)
            .setColor()
            message.channel.sendEmbed(embed);
            break;

        case "play":
            if(!args[1]){
                message.channel.sendMessage("Debes insertar un link de Youtube ");
                return;
            }

            if(!message.member.voiceChannel) {
                message.channel.sendMessage("Debo estar en un canal de voz ");
                return;
            }
            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue:[]
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);
            
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection,message);
                });
            break;
        case "siguiente":
                var server = servers[message.guild.id];
                if(server.dispatcher) server.dispatcher.end();
            break;
        case "para":
            var server = servers[message.guild.id];
            if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();  
            break;
        default:
            message.channel.sendMessage("No encuentro ese comando bbcito");
    }
});

bot.login(Token);