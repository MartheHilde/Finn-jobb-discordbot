// Import necessary modules
require('dotenv').config();
const { Client, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const token = process.env.TOKEN;
const channelID = process.env.CHANNEL_ID;
const fetch = require('node-fetch');
const schedule = require('node-schedule');

// eslint-disable-next-line no-undef
globalThis.fetch = fetch;
const { getJobs } = require('finn-jobb');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    // Reference to channel
    const channel = await client.channels.fetch(channelID);
    if (!channel) return console.error('Invalid channel ID in .env');

    // Fetch FINN.NO jobs
    const finnJobs = await getJobs({
        getFinnJobs: true,
    });

    // Create messages
    const messages = [];
    let currentMessage = '';

    for (const job of finnJobs) {
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
        console.log(`Sent message for FINN ${i + 1} of ${messages.length}`);
    }

    //Fetch KODE24.no JOBS
    const kodeJobs = await getJobs({
        getKode24Jobs: true,
    });

    for (const kodejob of kodeJobs) {
        const jobContent = `**${kodejob.tekst}**\nLocation: ${kodejob.lokasjon}\nDate: ${kodejob.dato}\nLink: ${kodejob.id}`;

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
        console.log(`Sent message for Kode24 ${i + 1} of ${messages.length}`);
    }
    //
    // End application
    //
    // console.log("Ending process... Thank you for your service!")
    // process.exit(0);
});

// Schedule the job to run every Friday at 12 pm
// schedule.scheduleJob('0 12 * * 5', function () {
    schedule.scheduleJob('* * * * *', function () {
        //TEST
    console.log('Running job-finder at 12 pm on Fridays');
    getJobs();
});

// Login with the token
client.login(token);