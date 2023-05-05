const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, channelID } = require('./config.json');
const getJobs = require('finn-jobb');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

//reference to channel
  const channel = await client.channels.fetch(channelID);
  if (!channel) return console.error("Invalid channel ID in config.json");

  // fetch job
  const jobs = await getJobs();

  // create message
  const message = jobs.map((job) => {
    return `**${job.tekst}**
    Location: ${job.lokasjon}
    Date: ${job.dato}
    Link: ${job.link}
    `;
  }).join('\n\n');

  // send message
  client.channels.cache.get(channelID).send(message);
});

client.login(token);