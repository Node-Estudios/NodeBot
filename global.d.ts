// declare environment variables
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production'
        errorWebhookURL: string
        DEBUG_MODE: 'true' | 'false'
        DEVS: string
    }
}
