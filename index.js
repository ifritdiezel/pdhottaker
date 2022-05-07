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
  if (message.channel.type != 'GUILD_TEXT');
  if (!message.content.startsWith("!opinion")) return;
  let webhook;

  try{
	   const webhooks = await message.channel.fetchWebhooks();
     webhook = webhooks.find(wh => wh.id === webhookdb[message.guildId+message.channelId]);
   } catch (error){
     return;
   }

  if ((message.content == "!opinionsetup") && !webhook){
    message.channel.createWebhook('PD Hot take generator', {avatar: null}).then(webhook => {
      webhookdb[message.guildId+message.channelId] = webhook.id;
      fs.writeFile('./webhookdb.json', JSON.stringify(webhookdb), err => {if(err) throw err;});
      try{message.channel.send("Created a webhook here!");} catch(error){return;};
      console.log("Registered a new channel");
    })
  }

  if (!webhook) return;

  if (message.content ==  "!opinion") {
    let itemcategory = Math.floor((Math.random()*strings.items.length));
    let itemsincategory = strings.items[itemcategory].length;
    let firstitemkey = Math.floor( (Math.random()*itemsincategory));
    let seconditemkey = (firstitemkey + Math.floor( Math.random()*itemsincategory) + 1) % itemsincategory;

    content = [
      strings.genericopeners.random() + " " + strings.items[itemcategory][firstitemkey] + " " + strings.comparisons.random() + " "+ strings.items[itemcategory][seconditemkey] + " " + strings.conditions.random() + ". " + capitalize(strings.finishers.random()),
      capitalize(strings.opinionopeners.random()) + " " + strings.items[itemcategory][firstitemkey] + " " + strings.balancesuggestions.random(),
      strings.genericopeners.random() + " " + strings.subclasses.random()  + " sucks unless you have " + strings.items[itemcategory][firstitemkey]
    ].random();

    webhook.send({
      content: content,
       username: strings.nicknames.random(),
     });
  }

});

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.login(bottoken);
