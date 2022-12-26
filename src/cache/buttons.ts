import { Collection, ButtonInteraction } from 'discord.js'
type Button = (interaction: ButtonInteraction<'cached'>) => Promise<any>
export default new Collection<string, Button>()
