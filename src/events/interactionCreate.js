import client from '../client.js'
import HandleButton from '../structures/interaction/buttoninteraction.js';
import HandleSelectMenu from '../structures/interaction/selectMenuInteraction.js';
import ChatInputInteractionCommand from '../structures/interaction/chatInputInteractionCommand.js';

client.on('interactionCreate', async interaction => {
   client.interactions++
   if (interaction.isChatInputCommand()) return await ChatInputInteractionCommand(interaction)
   if (interaction.isButton()) return await HandleButton(interaction);
   if (interaction.isAnySelectMenu()) return await HandleSelectMenu(interaction)
   if (interaction.isModalSubmit()) return await ModalInteractionCommand(interaction)
});



