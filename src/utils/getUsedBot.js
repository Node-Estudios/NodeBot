module.exports = function getUsedBot(interaction) {
    return new Promise((resolve, reject) => {
		interaction.guild.members.fetch(process.env.bot1id).then(member => {
			if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
				resolve(process.env.bot1id)
			} else {
				interaction.guild.members.fetch(process.env.bot2id).then(member => {
					if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
						resolve(process.env.bot2id)
					} else {
						interaction.guild.members.fetch(process.env.bot3id).then(member => {
							if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
								resolve(process.env.bot3id)
							} else {
								interaction.guild.members.fetch(process.env.bot4id).then(member => {
									if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
										resolve(process.env.bot4id)
									} else {
										resolve(0)
									} 
								}).catch(() => resolve(0))
							} 
						}).catch(() => {
							interaction.guild.members.fetch(process.env.bot4id).then(member => {
								if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
									resolve(process.env.bot4id)
								} else {
									resolve(0)
								} 
							}).catch(() => resolve(0))
						})
					}
				}).catch(() => {
					interaction.guild.members.fetch(process.env.bot3id).then(member => {
						if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
							resolve(process.env.bot3id)
						} else {
							interaction.guild.members.fetch(process.env.bot4id).then(member => {
								if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
									resolve(process.env.bot4id)
								} else {
									resolve(0)
								} 
							}).catch(() => resolve(0))
						} 
					}).catch(() => {
						interaction.guild.members.fetch(process.env.bot4id).then(member => {
							if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
								resolve(process.env.bot4id)
							} else {
								resolve(0)
							} 
						}).catch(() => resolve(0))
					})
				})
			}
		}).catch(() => {
			interaction.guild.members.fetch(process.env.bot2id).then(member => {
				if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
					resolve(process.env.bot2id)
				} else {
					interaction.guild.members.fetch(process.env.bot3id).then(member => {
						if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
							resolve(process.env.bot3id)
						} else {
							interaction.guild.members.fetch(process.env.bot4id).then(member => {
								if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
									resolve(process.env.bot4id)
								} else {
									resolve(0)
								} 
							}).catch(() => resolve(0))
						} 
					}).catch(() => {
						interaction.guild.members.fetch(process.env.bot4id).then(member => {
							if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
								resolve(process.env.bot4id)
							} else {
								resolve(0)
							} 
						}).catch(() => resolve(0))
					})
				}
			}).catch(() => {
				interaction.guild.members.fetch(process.env.bot3id).then(member => {
					if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
						resolve(process.env.bot3id)
					} else {
						interaction.guild.members.fetch(process.env.bot4id).then(member => {
							if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
								resolve(process.env.bot4id)
							} else {
								resolve(0)
							} 
						}).catch(() => resolve(0))
					} 
				}).catch(() => {
					interaction.guild.members.fetch(process.env.bot4id).then(member => {
						if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
							resolve(process.env.bot4id)
						} else {
							resolve(0)
						} 
					}).catch(() => resolve(0))
				})
			})
		})
	})
};
  