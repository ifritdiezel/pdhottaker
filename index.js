const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES + Intents.FLAGS.GUILDS ] });

const { bottoken } = require("./config.json");
const webhookdb = require("./webhookdb")
const fs = require('fs');
const strings = require("./strings.json");

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (message.webhookID) return;
  if (message.channel.type != 'GUILD_TEXT') return;
  if (!message.content.startsWith("!opinion")) return;
  let webhook;

  try{
	   const webhooks = await message.channel.fetchWebhooks();
     webhook = webhooks.find(wh => wh.id === webhookdb[message.guildId+message.channelId]);
   } catch (error){
     webhook = false;
   }

  if ((message.content == "!opinionsetup") && !webhook){
    message.channel.createWebhook('PD Hot take generator', {avatar: null}).then(webhook => {
      webhookdb[message.guildId+message.channelId] = webhook.id;
      fs.writeFile('./webhookdb.json', JSON.stringify(webhookdb), err => {if(err) throw err;});
      try{message.channel.send("Created a webhook here!");} catch(error){return;};
      console.log("Registered a new channel");
    });
    return;
  }

  if (!webhook) {
      try{message.channel.send(`Run !opinionsetup to add the bot to this channel. If it still doesn't work make sure the bot has the "Manage webhooks" permission.`)} catch (error) {return;}
      return;
  };

  if (message.content ==  "!opinion") {
    let itemcategory = Math.floor((Math.random()*strings.items.length));
    let shuffleditems = shuffle(strings.items[itemcategory]);

    content = [
      strings.genericopeners.random() + " " + shuffleditems[0] + " " + strings.comparisons.random() + " "+ shuffleditems[1] + " " + strings.conditions.random() + ". " + capitalize(strings.finishers.random()),
      capitalize(strings.opinionopeners.random()) + " " + shuffleditems[0] + " " + strings.balancesuggestions.random(),
      strings.genericopeners.random() + " " + strings.subclasses.random()  + " sucks unless you have " + shuffleditems[0]
    ].random();

    webhook.send({
      content: content,
      username: strings.nicknames.random(),
    });

    }


});

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.login(bottoken);
