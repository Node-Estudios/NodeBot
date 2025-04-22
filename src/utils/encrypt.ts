import { ENCRYPTION_KEY } from '#env'
import { ALGORITHM } from '#constants'
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

export async function encrypt(secret: string): Promise<string> {
    const key = Buffer.from(ENCRYPTION_KEY, 'hex')
    const iv = randomBytes(16)
    const cipher = createCipheriv(ALGORITHM, key, iv)
    const encrypted = cipher.update(secret, 'utf8', 'hex') + cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
}

export async function decrypt(encrypted: string): Promise<string> {
    const [iv, encryptedText] = encrypted.split(':')
    const key = Buffer.from(ENCRYPTION_KEY, 'hex')
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'))
    return (
        decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8')
    )
}
