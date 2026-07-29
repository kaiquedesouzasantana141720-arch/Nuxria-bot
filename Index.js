const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const express = require('express');
const db = require('quick.db');

const app = express();
app.get('/', (req, res) => res.send('Nuxria Online'));
app.listen(3000);

const token = process.env.TOKEN || require('./token.json').token;
const clientId = '1530025218129530920'; // PEGA EM: discord.com/developers/applications

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const commands = [
  new SlashCommandBuilder().setName('fila').setDescription('Ver seus coins'),
  new SlashCommandBuilder().setName('ping').setDescription('Testar se o bot tá on'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

client.once('ready', async () => {
  console.log(`[NUXRIA] Logado como ${client.user.tag}`);
  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('[OK] Comandos / registrados');
  } catch (error) { console.error(error); }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong! Nuxria ON');
  }
  
  if (interaction.commandName === 'fila') {
    const user = interaction.user;
    const coins = db.get(`coins_${user.id}`) || 100;
    await interaction.reply(`💰 **Seus Coins**\n${user}, você tem **${coins} coins**!`);
  }
});

client.login(token);
