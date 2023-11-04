require('dotenv').config();
const { Client, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const token = process.env.TOKEN;
const channelID = process.env.CHANNEL_ID;
const fetch = require('node-fetch');
const schedule = require('node-schedule');
const { getJobs } = require('finn-jobb');

// eslint-disable-next-line no-undef
globalThis.fetch = fetch;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Function to fetch and send job messages
async function fetchAndSendJobs() {
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

        // Fetch KODE24.no JOBS
        const kodeJobs = await getJobs({
            getKode24Jobs: true,
        });

        // Create new messages array and current message for KODE24 jobs
        const messagesKode24 = [];
        currentMessage = '';

        for (const kodejob of kodeJobs) {
            const jobContent = `**${kodejob.tekst}**\nLocation: ${kodejob.lokasjon}\nDate: ${kodejob.dato}\nLink: ${kodejob.id}`;

            if (currentMessage.length + jobContent.length > 2000) {
                messagesKode24.push(currentMessage);
                currentMessage = '';
            }

            currentMessage += `${jobContent}\n\n`;
        }

        if (currentMessage.length > 0) {
            messagesKode24.push(currentMessage);
        }

        // Send KODE24 messages
        for (let i = 0; i < messagesKode24.length; i++) {
            const message = messagesKode24[i];
            await channel.send({
                content: message,
                flags: MessageFlags.SuppressEmbeds, // Disable link previews
            });
            console.log(`Sent message for Kode24 ${i + 1} of ${messagesKode24.length}`);
        }

        // End application
        console.log("Ending process... Thank you for your service!")
        // process.exit(0);
    });

    // Login with the token
    client.login(token);
}

// Schedule the job to run every Friday at 12 pm
// schedule.scheduleJob('0 12 * * 5', function () {
    schedule.scheduleJob('* * * * *', function () {
        //TEST
    console.log('TESTING Running job-finder at 12 pm on Fridays');
    fetchAndSendJobs();
});
