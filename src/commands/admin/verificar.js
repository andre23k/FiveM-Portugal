import { ApplicationCommandType, PermissionFlagsBits, ButtonStyle, ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { PermissionsTranslate, BitColors } from '../../util/constants.js';
import { createRequire } from 'node:module';
import Database from '../../database/Database.js';
const require = createRequire(import.meta.url);
const { e } = require('../../JSON/emojis.json');

export default {
    name: "verificar",
    description: "〔🛠 Admin〕 Ative meu sistema de verificação.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    options: [
        {
            name: 'channel-config',
            description: 'Para qual canal o sistema de verificar vai?',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "channel-log",
            description: "Qual canal vai os logs de verificação?",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "role-verification",
            description: "Qual cargo vai ser setado nos membros?",
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        try {
            const ChannelConfigId = interaction.options.getChannel('channel-config')?.id;
            const ChannellogId = interaction.options.getChannel('channel-log')?.id;
            const Roleverification = interaction.options.getRole('role-verification')?.id;
            const guildId = interaction.guild.id;

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.Administrator))
                return await interaction.reply({
                    content: `${e.Saphire_recusado} | Eu preciso da permissão **\`${PermissionsTranslate.ManageRoles}\`** e **\`${PermissionsTranslate.Administrator}\`** para executar este comando.`,
                    ephemeral: true
                });


            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
                return await interaction.reply({
                    content: `${e.Saphire_recusado} | Você não tem permissão para usar esse comando.`,
                    ephemeral: true
                });

            await Database.Guild.findOneAndUpdate(
                { Id: guildId },
                {
                    $set: {
                        'verification.channelconfig': ChannelConfigId,
                        'verification.channellog': ChannellogId,
                        'verification.roleverifcationId': Roleverification
                    },
                },
                { upsert: true, new: true }
            );

            await interaction.reply({
                content: `Sistema de verificação foi configurado com sucesso.`,
                ephemeral: true
            });

            const channelConfig = client.channels.cache.get(ChannelConfigId);
            if (channelConfig) {
                await channelConfig.send({
                    embeds: [{
                        title: `Sistema de verificação FiveM Portugal`,
                        description: `Clique no botão abaixo para receber acesso ao servidor.`,
                        color: BitColors.Blue
                    }],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: `Verificar`,
                                    emoji: `${e.Ok}`,
                                    custom_id: `verificar`,
                                    style: ButtonStyle.Primary,
                                }
                            ]
                        }
                    ]
                });
            }
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: `${e.Desespero} | Ocorreu um erro ao executar esse comando!`,
                ephemeral: true
            });
        }
    }
};
