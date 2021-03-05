exports.run = async (client, message, args) => {

    if(!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send(':no_entry: Vous devez avoir des autorisations pour gérer les messages afin d\'utiliser cette commande')
  
    const channel = message.guild.channels.get(client.utils.parseMention(args[0]))
  
    if(!channel || channel.type !== 'text')
      return message.channel.send(`:x: Je ne trouve pas de canal texte basé sur ${client.utils.escapeMarkdown(args[0])}`)
  
    if(!channel.permissionsFor(message.guild.me).has('MANAGE_WEBHOOKS'))
      return message.channel.send(`:no_entry: Je ne dispose pas des autorisations nécessaires pour créer des webhooks dans ${channel}`)
  
    const msg = args[1]
  
    if(!msg)
      return message.channel.send(':x: Veuillez spécifier l\'ID du message que vous souhaitez déplacer')
  
    message.channel.fetchMessage(msg).then(async (m) => {
  
      const wh = await channel.createWebhook('Message en mouvement', client.user.displayAvatarURL, `Message déplacé ${message.author.tag}`)
  
      await wh.send(m.content, {disableEveryone: true, username: m.author.username, avatarURL: m.author.displayAvatarURL})
      await wh.delete('A fait son travail')
  
      await m.delete()
  
      message.channel.send(':white_check_mark: le message a été déplacé avec succès et l\'original a été supprimé')
  
  
    }).catch((e) => {
      if(e.code === 50035)
        return message.channel.send(':x: ID de message non valide')
  
      if(e.code === 10008)
        return message.channel.send(':x: L\'ID fourni ne correspond pas à un message. Assurez-vous également que le message a été envoyé exactement sur le même canal que celui sur lequel vous utilisez cette commande.')
  
      console.error(e)
      return message.channel.send(':x: Une erreur s\'est produite lors de la tentative de déplacement du message. Consultez votre console pour plus d\'informations sur cette erreur')
    })
  }
  
  exports.help = {
    name: 'move',
    info: 'Déplace un message vers un autre canal',
    usage: '<channel> <messageid>',
    unlisted: false,
  }
  
  exports.config = {
    guildOnly: true,
    ownerOnly: false,
    aliases: [],
  }
