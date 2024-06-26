import fetch from 'node-fetch'
import { createWriteStream, existsSync } from 'fs'
import { promisify } from 'util'
import { join } from 'path'

let confirmation = {}
let repository = 'FahriAdison/New-WaBot'
let branch = 'main'

async function handler(m, { text, args }) {
  if (!args || !args[0]) throw `lah`
    let res = await fetch(`https://raw.githubusercontent.com/${repository}/${branch}/${text}`)
    if (!res.ok) throw await res.text()
    let filename = join(__dirname(), '..', text)
    if (existsSync(filename)) {
        confirmation[m.sender] = {
            res,
            filename,
            text,
            timeout: setTimeout(() => (m.reply('timed out'),delete confirmation[m.sender]), 60000)
        }
        throw 'File exists, are you sure want to overwrite? (Y/n) (60s Timeout)'
    }
    res.body.pipe(createWriteStream(filename))
    res.body.once('end', () => {
        m.reply('Done update!')
        conn.sendFile(m.chat, filename, text, null, m).catch(console.error)
    })
}

handler.all = async m => {
    if (!(m.sender in confirmation)) return
    let { res, filename, text, timeout } = confirmation[m.sender]
    if (/^y(es|a)?$/i.test(m.text)) {
        res.body.pipe(createWriteStream(filename))
        res.body.once('end', () => {
            m.reply('Done overwrite!')
            conn.sendFile(m.chat, filename, text, null, m).catch(console.error)
        })
        clearTimeout(timeout)
        delete confirmation[m.sender]
        return !0
    } else if (/^no?$/i.test(m.text)) {
        delete confirmation[m.sender]
        m.reply('Rejected')
        clearTimeout(timeout)
        return !0
    }
}

handler.rowner = true
handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update']

handler.command = /^(up|update)$/i


export default handler