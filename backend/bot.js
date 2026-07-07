require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder,
        EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const EVENTS = ['robo-race', 'robo-sumo', 'line-follower', 'robo-soccer'];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once('ready', () => console.log(`Logged in as ${client.user.tag}`));

client.on('interactionCreate', async (i) => {
  if (i.isChatInputCommand() && i.commandName === 'event-roles') {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('event-select')
      .setPlaceholder('Choose your events...')
      .setMinValues(0).setMaxValues(EVENTS.length)
      .addOptions(EVENTS.map(e => ({ label: e, value: e })));

    const embed = new EmbedBuilder()
      .setTitle('Event Roles')
      .setDescription('Select the events you are participating in.\n**You can select multiple events.**');

    await i.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(menu)] });
  }

  if (i.isStringSelectMenu() && i.customId === 'event-select') {
    const guild = i.guild, member = i.member, selected = i.values;
    for (const name of EVENTS) {
      let role = guild.roles.cache.find(r => r.name === name)
        || await guild.roles.create({ name });
      const has = member.roles.cache.has(role.id);
      if (selected.includes(name) && !has) await member.roles.add(role);
      if (!selected.includes(name) && has) await member.roles.remove(role);
    }
    await i.reply({ content: `Updated: ${selected.join(', ') || 'none'}`, ephemeral: true });
  }
});

new REST({ version: '10' }).setToken(TOKEN).put(
  Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
  { body: [new SlashCommandBuilder().setName('event-roles').setDescription('Post the event role selector').toJSON()] }
);

client.login(TOKEN);