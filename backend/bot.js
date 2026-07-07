require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

const { TOKEN, GUILD_ID } = process.env;
const CHANNEL_ID = '1523995098470416466';
const EVENTS = ['robo-race', 'robo-sumo', 'line-follower', 'robo-soccer'];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  const menu = new StringSelectMenuBuilder()
    .setCustomId('event-select')
    .setPlaceholder('Choose your events...')
    .setMinValues(0)
    .setMaxValues(EVENTS.length)
    .addOptions(EVENTS.map(e => ({ label: e, value: e })));

  const embed = new EmbedBuilder()
    .setTitle('Event Roles')
    .setDescription('Select the events you are participating in.\n**You can select multiple events.**');

  await channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(menu)] });
});

client.on('interactionCreate', async (i) => {
  if (!i.isStringSelectMenu() || i.customId !== 'event-select') return;

  const guild = i.guild, member = i.member, selected = i.values;
  for (const name of EVENTS) {
    let role = guild.roles.cache.find(r => r.name === name)
      || await guild.roles.create({ name });
    const has = member.roles.cache.has(role.id);
    if (selected.includes(name) && !has) await member.roles.add(role);
    if (!selected.includes(name) && has) await member.roles.remove(role);
  }
  await i.reply({ content: `Updated: ${selected.join(', ') || 'none'}`, ephemeral: true });
});

client.login(TOKEN);