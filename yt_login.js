import { Innertube, UniversalCache } from 'youtubei.js'
import { promises as fs } from 'fs'
import path from 'path'

// Este script se debe ejecutar desde la raíz del proyecto
const CREDENTIALS_PATH = path.join(process.cwd(), 'youtube_credentials.json')

async function authenticate() {
    console.log('[YouTube Auth] Iniciando el proceso de autenticación...')
    const youtube = await Innertube.create({ cache: new UniversalCache() })

    youtube.session.on('auth-pending', data => {
        console.log(
            `\n[YouTube Auth] Abre esta URL en tu navegador: ${data.verification_url}`,
        )
        console.log(
            `[YouTube Auth] E introduce este código: ${data.user_code}\n`,
        )
    })

    youtube.session.on('auth', async ({ credentials }) => {
        try {
            await fs.writeFile(
                CREDENTIALS_PATH,
                JSON.stringify(credentials, null, 2),
                'utf-8',
            )
            console.log(
                `[YouTube Auth] ¡Autenticación exitosa! Credenciales guardadas en ${CREDENTIALS_PATH}`,
            )
            console.log('[YouTube Auth] Ya puedes cerrar este script (Ctrl+C).')
        } catch (error) {
            console.error(
                '[YouTube Auth] Error al guardar las credenciales:',
                error,
            )
            process.exit(1)
        }
    })

    youtube.session.on('update-credentials', async ({ credentials }) => {
        try {
            await fs.writeFile(
                CREDENTIALS_PATH,
                JSON.stringify(credentials, null, 2),
                'utf-8',
            )
            console.log(
                `[YouTube Auth] ¡Credenciales actualizadas! Guardadas en ${CREDENTIALS_PATH}`,
            )
        } catch (error) {
            console.error(
                '[YouTube Auth] Error al actualizar y guardar las credenciales:',
                error,
            )
        }
    })

    await youtube.session.signIn()
    console.log('[YouTube Auth] Esperando la autenticación en el navegador...')
}

authenticate().catch(err => {
    console.error('Ocurrió un error inesperado durante la autenticación:', err)
    process.exit(1)
})
