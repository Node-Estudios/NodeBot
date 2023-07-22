// declare environment variables
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production'
        errorWebhookURL: string
        DEBUG_MODE: 'true' | 'false'
        DEVS: string
        TWITCH_AUTHORIZATION: string
        TWITCH_CLIENT_ID: string
        TWITCH_WEBHOOK_SECRET: string
    }
}
