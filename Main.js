const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const Settings = require("./settings.json");

const TOKEN = Settings.token;
const prefix = Settings.prefix;
const version = Settings.version

var bot = new Discord.Client();

var Currentsong = []
var servers = {};

var search = require('youtube-search');

var opts = {
 maxResults: 1,
 key: Settings.ytsearchkey
};

function play(connection,message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    message.channel.send("Now playing: " + Currentsong[0]);

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
    server.queue.shift();
    Currentsong.shift();
}

bot.on("ready", function() {
    console.log("Ready");
    bot.user.setPresence({ game: { name: `${prefix} / Version ${version}`, type: 0 }, })
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()) {
    case "waffles":
        message.channel.send("Waffles.", {
            file: "http://az616578.vo.msecnd.net/files/2016/04/22/6359688785958691901336655616_waffle1.JPG"
        })
        break;
    case "Confirm":
      if(message.author.equals(DarthFleeting)
        message.channel.send("Confirmed.")
          break;
    case "waffle":
        message.channel.send("Waffles.", {
            file: "http://az616578.vo.msecnd.net/files/2016/04/22/6359688785958691901336655616_waffle1.JPG"
        });
        break;
    case "pancake":
        message.channel.send("Must have autocorrected.", {
          file: "http://cdn.pcwallart.com/images/waffles-with-syrup-wallpaper-3.jpg"
        });
        break;
    case "ping":
        async function ping() {
          let pingMessage = await message.channel.send('Pinging...');
          pingMessage.edit(`Pong? | Took **${Math.abs(pingMessage.createdTimestamp - message.createdTimestamp)} ms**... I think.`);
        }

        ping();
        break;
    case "quote":
        message.channel.send("We have to remember what's important in life. Waffles, friends, and work. In that order.")
        break;
    case "kick":
        message.channel.send("User was kicked. Well, I actually don't have that power, but it would be cool if I did!")
        break;
    case "help":
        message.author.send("Waffles can help! \n ''~~help' gets you help. \n ''~~ping' gets your ping! \n ''~~waffle(s)' gets you some waffles! \n ''~~kick (mention)' kicks the mentioned person!")
        break;
    case "play":
        if (!args[1]) {
          message.channel.send("No link/keywords. Eat some waffles.")
          return;
        }

        if (!message.member.voiceChannel) {
          message.channel.send("You're not in a voice channel my waffle.")
          return;
        }

        if (!servers[message.guild.id]) servers[message.guild.id] = {
           queue: []
        };

        var server = servers[message.guild.id];
        var searchfor = message.content.substring(prefix.length + 5)

        search(searchfor, opts, function(err, results) {
        if(err) return console.log(err);
        Currentsong.push(results[0].title)
        server.queue.push(results[0].link);
        });

        if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
            play(connection,message);
        });
        break;
    case "skip":
        var server = servers[message.guild.id];

        if (server.dispatcher) server.dispatcher.end();
        break;
    case "stop":

    var server = servers[message.guild.id];

    if (message.guild.voiceConnection)
        {
            for (var i = server.queue.length - 1; i >= 0; i--)
            {
                server.queue.splice(i, 1);
         }
            server.dispatcher.end();
        }
        break;
    default:
    message.channel.send("Not a command! Eat some waffles fool.")
    }
});

bot.login(TOKEN);
