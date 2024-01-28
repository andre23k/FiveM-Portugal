import Database from '../../database/Database.js';

export class InviteManager {
    constructor() {
        this.inviteCounts = new Map();
        this.loadInviteCounts();
        this.arr = [];
        this.inviterId = 0;
    }

    async loadInviteCounts() {
        try {

            const inviteCounts = await Database.Invite.find({
                userid: this.inviterId,
            });
            for (const inviteCount of inviteCounts) {
                this.inviteCounts.set(this.inviterId, inviteCount.count);
            }
        } catch (error) {
            console.error('Erro ao carregar contagens de convites:', error);
        }
    }

    async saveInviteCounts() {
        try {
            const userId = this.inviterId;
            const count = this.inviteCounts.get(userId) || 0;
            await Database.Invite.findOne({ userid: this.inviterId});
            await Database.Invite.findOneAndUpdate(
                { userid: this.inviterId, },
                { $set: { count: count} },
                { upsert: true, new: true }

            )

        } catch (error) {
            console.error('Erro ao salvar', error);
        }
    }

    async handleGuildMemberAdd(member, inviter, invite, error) {
        let msg;
        const channel = member.guild.channels.cache.get("1194415819908731042");

        if (error) {
            return console.error(error);
        }

        if (!this.arr.includes(member.id)) {
            if (!inviter) {
                msg = `🇵🇹 | Bem-vindo ${member || `Not Found`}, foi convidado, mas não consegui descobrir quem o convidou!`;
            } else if (member.id === inviter.id) {
                msg = `🇵🇹 | Bem-vindo ${member || `Not Found`}, entrou no servidor pelo próprio convite!`;
            } else if (member.guild.vanityURLCode === invite?.code) {
                msg = `🇵🇹 | ${member || `Not Found`} entrou pelo convite personalizado!`;
            } else {
                this.inviterId = inviter.id;
                this.updateInviteCounts(this.inviterId);
                msg = `🇵🇹 | Bem-vindo ${member || `Not Found`}, foi convidado por <@!${this.inviterId || `Not Found`}>. Que agora tem ${this.getInviteCount(this.inviterId)} invites.`;
            }

            this.arr.push(member.id);
            await this.saveInviteCounts();
        } else {
            msg = `🇵🇹 | Bem-vindo ${member || `Not Found`}, entrou no servidor, mas já esteve aqui!`;
        }
        if (member.user.bot) msg = `🇵🇹 | Bem-vindo ${member || `Not Found`}, foi convidado por <@!${inviter.id || `Not Found`}>`;

        channel.send(msg);
    }

    updateInviteCounts(inviterId) {
        let currentCount = this.inviteCounts.get(inviterId) || 0;
        currentCount = currentCount + 1;
        this.inviteCounts.set(inviterId, currentCount);
    }

    getInviteCount(inviterId) {
        return this.inviteCounts.get(inviterId) || 0;
    }
}
