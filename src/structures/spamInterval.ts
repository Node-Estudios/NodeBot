export class spamIntervalDB {
    // Creamos una propiedad privada `_timestamps` que será una instancia de Map
    private _timestamps: Map<string, number>;

    constructor() {
        // Inicializamos la propiedad `_timestamps` como una instancia de Map
        this._timestamps = new Map();
    }

    // Método para agregar un usuario a la base de datos
    public addUser(user: string, ttl: number): void {
        // Obtenemos la hora actual en milisegundos
        const now = Date.now();

        // Agregamos el usuario y su hora de expiración (hora actual + ttl en milisegundos) a la base de datos
        this._timestamps.set(user, now + ttl);

        // Programamos la eliminación del usuario después de que haya transcurrido el tiempo de vida especificado
        setTimeout(() => this._timestamps.delete(user), ttl);
    }

    // Método para verificar si un usuario está presente en la base de datos
    public checkUser(user: string): boolean {
        // Obtenemos la hora actual en milisegundos
        const now = Date.now();

        // Obtenemos la hora de expiración del usuario
        const expirationTimestamp = this._timestamps.get(user);

        // Si el usuario no está presente en la base de datos o su tiempo de vida ha expirado, devolvemos false
        if (!expirationTimestamp || expirationTimestamp < now) {
            return false;
        }

        // Si el usuario está presente y su tiempo de vida no ha expirado, devolvemos true
        return true;
    }
}