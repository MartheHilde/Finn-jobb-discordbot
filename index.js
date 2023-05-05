// Import necessary modules
const { Client, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token, channelID } = require('./config.json');
const fetch = require('node-fetch');
// eslint-disable-next-line no-undef
globalThis.fetch = fetch;
const getJobs = require('finn-jobb');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    // Reference to channel
    const channel = await client.channels.fetch(channelID);
    if (!channel) return console.error('Invalid channel ID in config.json');

    // Fetch jobs
    const jobs = await getJobs();

    // Create messages
    const messages = [];
    let currentMessage = '';

    for (const job of jobs) {
        const jobContent = `**${job.tekst}**\nLocation: ${job.lokasjon}\nDate: ${job.dato}\nLink: ${job.link}`;

        if (currentMessage.length + jobContent.length > 2000) {
            messages.push(currentMessage);
            currentMessage = '';
        }

        currentMessage += `${jobContent}\n\n`;
    }

    if (currentMessage.length > 0) {
        messages.push(currentMessage);
    }

    // Send messages
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        await channel.send({
            content: message,
            flags: MessageFlags.SuppressEmbeds, // Disable link previews
        });
        console.log(`Sent message ${i + 1} of ${messages.length}`);
    }
});

// Login with the token
client.login(token);
