let handler = async (m, { participants }) => {
    
    global.DATABASE.data.chats[m.chat].isBanned = true
    m.reply('Done!')
    // } else m.reply('Ada nomor host disini...')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^banchat$/i

handler.owner = true

export default handler