# FINN-JOBB Discord bot

## Introduction
A discord bot used to fetch data from FINN.no API and Kode24. The API fetches relevant job listings related to tech and developement.  

## Installation

To install the application, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the folders directory.
3. Run npm install to install all the required dependencies.
4. Create a ".env" file, using the "example.env" file as template.

### The script makes use of the following:

- "discord.js": "^14.10.2",
- "dotenv": "^16.0.3",
- "finn-jobb": "1.0.7",
- "node-fetch": "^2.6.9"

## Usage

To start the bot, run the following command which is executed from the script in Makefile:

```Make run```

## Packages

FINN-Jobb: A package to get all developer jobs from finn.no created by Toremann. Depository is linked below.
[FINN-jobb](https://www.npmjs.com/package/finn-jobb)
[Depository](https://github.com/toremann/finn-jobb)


The function fetches job data from the [Kode24.no](https://www.kode24.no/) and [Finn.no](https://www.finn.no/) API, with a delay of 1 to 10 seconds between each page request to avoid overloading the API. The fetched job data is stored in an array, which is then filtered by the specified location and returned as a promise.