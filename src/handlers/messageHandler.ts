import { CommandInteraction, Message, Snowflake, User } from 'discord.js'

export class MessageHelper {
    msg: Message | CommandInteraction
    id: Snowflake
    author: User

    constructor (msg: Message | CommandInteraction) {
        this.msg = msg
        this.id = msg.id
        this.author = msg instanceof Message ? msg.author : msg.user
    }

    async sendMessage (content: any, followUp?: boolean) {
        if (this.msg instanceof CommandInteraction) {
            if (this.msg.replied || this.msg.deferred) {
                followUp ? this.msg = await this.msg.followUp(content) : this.msg = await this.msg.editReply(content)
            } else {
                // @ts-expect-error
                followUp ? this.msg = await this.msg.followUp(content) : this.msg = await this.msg.reply(content)
            }
            return this.msg
        } else {
             // @ts-expect-error
            followUp ? this.msg = await this.msg.channel.send(content) : this.msg = await this.msg.channel.send(content)
            return this.msg
        }
    }

    async sendEphemeralMessage (content: any, followUp?: boolean) {
        if (this.msg instanceof CommandInteraction) {
            if (this.msg.replied || this.msg.deferred) {
                followUp ? this.msg = await this.msg.followUp({ content, ephemeral: true }) : this.msg = await this.msg.editReply({ content })
            } else {
                return followUp ? this.msg = await this.msg.followUp({ content, ephemeral: true }) : await this.msg.reply({ content, ephemeral: true })
            }
            return this.msg
        } else {
             // @ts-expect-error
            followUp ? this.msg = await this.msg.channel.send(content) : this.msg = await this.msg.channel.send(content)
            return this.msg
        }
    }

    async editMessage (content: any) {
        if (this.msg instanceof CommandInteraction) {
            this.msg = await this.msg.editReply({ content })
            return this.msg
        } else {
            return this.msg.editable ? await this.msg.edit(content) : false
        }
    }

    async deleteMessage () {
        if (this.msg instanceof CommandInteraction) {
            return await this.msg.deleteReply()
        } else {
            return await this.msg.delete()
        }
    }
};
