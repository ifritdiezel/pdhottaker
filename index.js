const { Client, Intents, WebhookClient } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES + Intents.FLAGS.GUILDS ] });

const config = require("./config.json");
const webhookClient = new WebhookClient({ url: config.webhookurl });
const strings = require("./strings.json");

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (message.webhookID) return;

  if (message.content ==  "!opinion") {
    let itemcategory = Math.floor((Math.random()*strings.items.length));
    let itemsincategory = strings.items[itemcategory].length;
    let firstitemkey = Math.floor( (Math.random()*itemsincategory));
    let seconditemkey = ( firstitemkey + Math.floor((Math.random()*itemsincategory)) - 1 ) % itemsincategory;
    webhookClient.send({
      content: strings.openers.random() + " " + strings.items[itemcategory][firstitemkey] + " " + strings.comparisons.random() + " "+ strings.items[itemcategory][seconditemkey] + " " + strings.conditions.random() + ". " + strings.finishers.random(),
  	   username: strings.nicknames.random(),
     });
  }

});

client.once('ready', () => {
	console.log('Ready!');
});

client.login(config.bottoken);
