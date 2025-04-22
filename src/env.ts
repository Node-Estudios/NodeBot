process.loadEnvFile()
const { ENCRYPTION_KEY = '' } = process.env

if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY in .env is required')
if (!/^[0-9a-f]{64}$/i.test(ENCRYPTION_KEY))
    throw new Error(
        'ENCRYPTION_KEY in .env must be a valid 64 characters hexadecimal string',
    )

export { ENCRYPTION_KEY }
