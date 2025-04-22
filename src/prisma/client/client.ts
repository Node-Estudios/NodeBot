
/**
 * Client
 */

import * as runtime from '@prisma/client/runtime/library'
import * as process from 'node:process'
import * as path from 'node:path'
    import { fileURLToPath } from 'node:url'

    const __dirname = path.dirname(fileURLToPath(import.meta.url))


export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>


/**
 * Model Twitch
 * 
 */
export type Twitch = runtime.Types.Result.DefaultSelection<Prisma.$TwitchPayload>
/**
 * Model User
 * 
 */
export type User = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserCredentials
 * 
 */
export type UserCredentials = runtime.Types.Result.DefaultSelection<Prisma.$UserCredentialsPayload>



/**
 * Create the Client
 */
const config: runtime.GetPrismaClientConfig = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client"
    },
    "output": {
      "value": "/home/eli/code/NodeBot/src/prisma/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/home/eli/code/NodeBot/src/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativePath": "..",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "sqlite",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": null,
        "value": "file:./database.db"
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"./client\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./database.db\"\n}\n\nmodel Twitch {\n  streamer_id String\n  guild_id    String\n  channel_id  String\n  role_id     String?\n\n  @@id([streamer_id, guild_id])\n}\n\nmodel User {\n  id                String  @id\n  executed_commands Int     @default(0)\n  banned            Boolean @default(false)\n  roles             BigInt  @default(0)\n\n  user_credentials UserCredentials?\n\n  @@map(\"users\")\n}\n\nmodel UserCredentials {\n  id            Int      @id @default(autoincrement())\n  user_id       String   @unique\n  access_token  String\n  refresh_token String\n  expires       DateTime\n\n  user User @relation(fields: [user_id], references: [id])\n\n  @@map(\"users_credentials\")\n}\n",
  "inlineSchemaHash": "50d5305111c47ea814c758c5b7ff0ea9c9197d365362303be8009d564d5a6033",
  "copyEngine": true,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "dirname": ""
}
config.dirname = __dirname

config.runtimeDataModel = JSON.parse("{\"models\":{\"Twitch\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"streamer_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"guild_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"streamer_id\",\"guild_id\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"User\":{\"dbName\":\"users\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"executed_commands\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"banned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"roles\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BigInt\",\"nativeType\":null,\"default\":\"0\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_credentials\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserCredentials\",\"nativeType\":null,\"relationName\":\"UserToUserCredentials\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserCredentials\":{\"dbName\":\"users_credentials\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"access_token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refresh_token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expires\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"UserToUserCredentials\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{},\"types\":{}}")
config.engineWasm = undefined
config.compilerWasm = undefined



// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-debian-openssl-3.0.x.so.node")
path.join(process.cwd(), "src/prisma/client/libquery_engine-debian-openssl-3.0.x.so.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma")
path.join(process.cwd(), "src/prisma/client/schema.prisma")


interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Twitches
   * const twitches = await prisma.twitch.findMany()
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */
  new <
    ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
    U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
    ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs
  >(options?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>): PrismaClient<ClientOptions, U, ExtArgs>
}

/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Twitches
 * const twitches = await prisma.twitch.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export interface PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): runtime.Types.Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): runtime.Types.Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): runtime.Types.Utils.JsPromise<R>


  $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.twitch`: Exposes CRUD operations for the **Twitch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Twitches
    * const twitches = await prisma.twitch.findMany()
    * ```
    */
  get twitch(): Prisma.TwitchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userCredentials`: Exposes CRUD operations for the **UserCredentials** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserCredentials
    * const userCredentials = await prisma.userCredentials.findMany()
    * ```
    */
  get userCredentials(): Prisma.UserCredentialsDelegate<ExtArgs, ClientOptions>;
}

export const PrismaClient = runtime.getPrismaClient(config) as unknown as PrismaClientConstructor

export namespace Prisma {
  export type DMMF = typeof runtime.DMMF

  export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>

  /**
   * Validator
   */
  export const validator = runtime.Public.validator

  /**
   * Prisma Errors
   */

  export const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError

  export const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError

  export const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError

  export const PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export type PrismaClientInitializationError = runtime.PrismaClientInitializationError

  export const PrismaClientValidationError = runtime.PrismaClientValidationError
  export type PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export const sql = runtime.sqltag
  export const empty = runtime.empty
  export const join = runtime.join
  export const raw = runtime.raw
  export const Sql = runtime.Sql
  export type Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export const Decimal = runtime.Decimal
  export type Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export type Extension = runtime.Types.Extensions.UserArgs
  export const getExtensionContext = runtime.Extensions.getExtensionContext
  export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>
  export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>
  export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>
  export type Exact<A, W> = runtime.Types.Public.Exact<A, W>

  export type PrismaVersion = {
    client: string
    engine: string
  }

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export const prismaVersion: PrismaVersion = {
    client: "6.6.0",
    engine: "f676762280b54cd07c770017ed3711ddde35f37a"
  }

  /**
   * Utility Types
   */


  export type JsonObject = runtime.JsonObject
  export type JsonArray = runtime.JsonArray
  export type JsonValue = runtime.JsonValue
  export type InputJsonObject = runtime.InputJsonObject
  export type InputJsonArray = runtime.InputJsonArray
  export type InputJsonValue = runtime.InputJsonValue

  export const NullTypes = {
    DbNull: runtime.objectEnumValues.classes.DbNull as (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull),
    JsonNull: runtime.objectEnumValues.classes.JsonNull as (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull),
    AnyNull: runtime.objectEnumValues.classes.AnyNull as (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull),
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull = runtime.objectEnumValues.instances.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull = runtime.objectEnumValues.instances.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull = runtime.objectEnumValues.instances.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  export type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  export type Boolean = True | False

  export type True = 1

  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName = {
    Twitch: 'Twitch',
    User: 'User',
    UserCredentials: 'UserCredentials'
  } as const

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export interface TypeMapCb<ClientOptions = {}> extends runtime.Types.Utils.Fn<{extArgs: runtime.Types.Extensions.InternalArgs }, runtime.Types.Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "twitch" | "user" | "userCredentials"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Twitch: {
        payload: Prisma.$TwitchPayload<ExtArgs>
        fields: Prisma.TwitchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TwitchFindUniqueArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TwitchFindUniqueOrThrowArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload>
          }
          findFirst: {
            args: Prisma.TwitchFindFirstArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TwitchFindFirstOrThrowArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload>
          }
          findMany: {
            args: Prisma.TwitchFindManyArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload>[]
          }
          create: {
            args: Prisma.TwitchCreateArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload>
          }
          createMany: {
            args: Prisma.TwitchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TwitchCreateManyAndReturnArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload>[]
          }
          delete: {
            args: Prisma.TwitchDeleteArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload>
          }
          update: {
            args: Prisma.TwitchUpdateArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload>
          }
          deleteMany: {
            args: Prisma.TwitchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TwitchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TwitchUpdateManyAndReturnArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload>[]
          }
          upsert: {
            args: Prisma.TwitchUpsertArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$TwitchPayload>
          }
          aggregate: {
            args: Prisma.TwitchAggregateArgs<ExtArgs>
            result: runtime.Types.Utils.Optional<AggregateTwitch>
          }
          groupBy: {
            args: Prisma.TwitchGroupByArgs<ExtArgs>
            result: runtime.Types.Utils.Optional<TwitchGroupByOutputType>[]
          }
          count: {
            args: Prisma.TwitchCountArgs<ExtArgs>
            result: runtime.Types.Utils.Optional<TwitchCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: runtime.Types.Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: runtime.Types.Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: runtime.Types.Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserCredentials: {
        payload: Prisma.$UserCredentialsPayload<ExtArgs>
        fields: Prisma.UserCredentialsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserCredentialsFindUniqueArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserCredentialsFindUniqueOrThrowArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload>
          }
          findFirst: {
            args: Prisma.UserCredentialsFindFirstArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserCredentialsFindFirstOrThrowArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload>
          }
          findMany: {
            args: Prisma.UserCredentialsFindManyArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload>[]
          }
          create: {
            args: Prisma.UserCredentialsCreateArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload>
          }
          createMany: {
            args: Prisma.UserCredentialsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCredentialsCreateManyAndReturnArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload>[]
          }
          delete: {
            args: Prisma.UserCredentialsDeleteArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload>
          }
          update: {
            args: Prisma.UserCredentialsUpdateArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload>
          }
          deleteMany: {
            args: Prisma.UserCredentialsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserCredentialsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserCredentialsUpdateManyAndReturnArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload>[]
          }
          upsert: {
            args: Prisma.UserCredentialsUpsertArgs<ExtArgs>
            result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCredentialsPayload>
          }
          aggregate: {
            args: Prisma.UserCredentialsAggregateArgs<ExtArgs>
            result: runtime.Types.Utils.Optional<AggregateUserCredentials>
          }
          groupBy: {
            args: Prisma.UserCredentialsGroupByArgs<ExtArgs>
            result: runtime.Types.Utils.Optional<UserCredentialsGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCredentialsCountArgs<ExtArgs>
            result: runtime.Types.Utils.Optional<UserCredentialsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension = runtime.Extensions.defineExtension as unknown as runtime.Types.Extensions.ExtendsHook<"define", Prisma.TypeMapCb, runtime.Types.Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    twitch?: TwitchOmit
    user?: UserOmit
    userCredentials?: UserCredentialsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => runtime.Types.Utils.JsPromise<T>,
  ) => runtime.Types.Utils.JsPromise<T>

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Twitch
   */

  export type AggregateTwitch = {
    _count: TwitchCountAggregateOutputType | null
    _min: TwitchMinAggregateOutputType | null
    _max: TwitchMaxAggregateOutputType | null
  }

  export type TwitchMinAggregateOutputType = {
    streamer_id: string | null
    guild_id: string | null
    channel_id: string | null
    role_id: string | null
  }

  export type TwitchMaxAggregateOutputType = {
    streamer_id: string | null
    guild_id: string | null
    channel_id: string | null
    role_id: string | null
  }

  export type TwitchCountAggregateOutputType = {
    streamer_id: number
    guild_id: number
    channel_id: number
    role_id: number
    _all: number
  }


  export type TwitchMinAggregateInputType = {
    streamer_id?: true
    guild_id?: true
    channel_id?: true
    role_id?: true
  }

  export type TwitchMaxAggregateInputType = {
    streamer_id?: true
    guild_id?: true
    channel_id?: true
    role_id?: true
  }

  export type TwitchCountAggregateInputType = {
    streamer_id?: true
    guild_id?: true
    channel_id?: true
    role_id?: true
    _all?: true
  }

  export type TwitchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Twitch to aggregate.
     */
    where?: TwitchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Twitches to fetch.
     */
    orderBy?: TwitchOrderByWithRelationInput | TwitchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TwitchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Twitches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Twitches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Twitches
    **/
    _count?: true | TwitchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TwitchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TwitchMaxAggregateInputType
  }

  export type GetTwitchAggregateType<T extends TwitchAggregateArgs> = {
        [P in keyof T & keyof AggregateTwitch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTwitch[P]>
      : GetScalarType<T[P], AggregateTwitch[P]>
  }




  export type TwitchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: TwitchWhereInput
    orderBy?: TwitchOrderByWithAggregationInput | TwitchOrderByWithAggregationInput[]
    by: TwitchScalarFieldEnum[] | TwitchScalarFieldEnum
    having?: TwitchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TwitchCountAggregateInputType | true
    _min?: TwitchMinAggregateInputType
    _max?: TwitchMaxAggregateInputType
  }

  export type TwitchGroupByOutputType = {
    streamer_id: string
    guild_id: string
    channel_id: string
    role_id: string | null
    _count: TwitchCountAggregateOutputType | null
    _min: TwitchMinAggregateOutputType | null
    _max: TwitchMaxAggregateOutputType | null
  }

  type GetTwitchGroupByPayload<T extends TwitchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TwitchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TwitchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TwitchGroupByOutputType[P]>
            : GetScalarType<T[P], TwitchGroupByOutputType[P]>
        }
      >
    >


  export type TwitchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    streamer_id?: boolean
    guild_id?: boolean
    channel_id?: boolean
    role_id?: boolean
  }, ExtArgs["result"]["twitch"]>

  export type TwitchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    streamer_id?: boolean
    guild_id?: boolean
    channel_id?: boolean
    role_id?: boolean
  }, ExtArgs["result"]["twitch"]>

  export type TwitchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    streamer_id?: boolean
    guild_id?: boolean
    channel_id?: boolean
    role_id?: boolean
  }, ExtArgs["result"]["twitch"]>

  export type TwitchSelectScalar = {
    streamer_id?: boolean
    guild_id?: boolean
    channel_id?: boolean
    role_id?: boolean
  }

  export type TwitchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"streamer_id" | "guild_id" | "channel_id" | "role_id", ExtArgs["result"]["twitch"]>

  export type $TwitchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Twitch"
    objects: {}
    scalars: runtime.Types.Extensions.GetPayloadResult<{
      streamer_id: string
      guild_id: string
      channel_id: string
      role_id: string | null
    }, ExtArgs["result"]["twitch"]>
    composites: {}
  }

  export type TwitchGetPayload<S extends boolean | null | undefined | TwitchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TwitchPayload, S>

  export type TwitchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
    Omit<TwitchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TwitchCountAggregateInputType | true
    }

  export interface TwitchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Twitch'], meta: { name: 'Twitch' } }
    /**
     * Find zero or one Twitch that matches the filter.
     * @param {TwitchFindUniqueArgs} args - Arguments to find a Twitch
     * @example
     * // Get one Twitch
     * const twitch = await prisma.twitch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TwitchFindUniqueArgs>(args: SelectSubset<T, TwitchFindUniqueArgs<ExtArgs>>): Prisma__TwitchClient<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Twitch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TwitchFindUniqueOrThrowArgs} args - Arguments to find a Twitch
     * @example
     * // Get one Twitch
     * const twitch = await prisma.twitch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TwitchFindUniqueOrThrowArgs>(args: SelectSubset<T, TwitchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TwitchClient<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Twitch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitchFindFirstArgs} args - Arguments to find a Twitch
     * @example
     * // Get one Twitch
     * const twitch = await prisma.twitch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TwitchFindFirstArgs>(args?: SelectSubset<T, TwitchFindFirstArgs<ExtArgs>>): Prisma__TwitchClient<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Twitch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitchFindFirstOrThrowArgs} args - Arguments to find a Twitch
     * @example
     * // Get one Twitch
     * const twitch = await prisma.twitch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TwitchFindFirstOrThrowArgs>(args?: SelectSubset<T, TwitchFindFirstOrThrowArgs<ExtArgs>>): Prisma__TwitchClient<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Twitches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Twitches
     * const twitches = await prisma.twitch.findMany()
     * 
     * // Get first 10 Twitches
     * const twitches = await prisma.twitch.findMany({ take: 10 })
     * 
     * // Only select the `streamer_id`
     * const twitchWithStreamer_idOnly = await prisma.twitch.findMany({ select: { streamer_id: true } })
     * 
     */
    findMany<T extends TwitchFindManyArgs>(args?: SelectSubset<T, TwitchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Twitch.
     * @param {TwitchCreateArgs} args - Arguments to create a Twitch.
     * @example
     * // Create one Twitch
     * const Twitch = await prisma.twitch.create({
     *   data: {
     *     // ... data to create a Twitch
     *   }
     * })
     * 
     */
    create<T extends TwitchCreateArgs>(args: SelectSubset<T, TwitchCreateArgs<ExtArgs>>): Prisma__TwitchClient<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Twitches.
     * @param {TwitchCreateManyArgs} args - Arguments to create many Twitches.
     * @example
     * // Create many Twitches
     * const twitch = await prisma.twitch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TwitchCreateManyArgs>(args?: SelectSubset<T, TwitchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Twitches and returns the data saved in the database.
     * @param {TwitchCreateManyAndReturnArgs} args - Arguments to create many Twitches.
     * @example
     * // Create many Twitches
     * const twitch = await prisma.twitch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Twitches and only return the `streamer_id`
     * const twitchWithStreamer_idOnly = await prisma.twitch.createManyAndReturn({
     *   select: { streamer_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TwitchCreateManyAndReturnArgs>(args?: SelectSubset<T, TwitchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Twitch.
     * @param {TwitchDeleteArgs} args - Arguments to delete one Twitch.
     * @example
     * // Delete one Twitch
     * const Twitch = await prisma.twitch.delete({
     *   where: {
     *     // ... filter to delete one Twitch
     *   }
     * })
     * 
     */
    delete<T extends TwitchDeleteArgs>(args: SelectSubset<T, TwitchDeleteArgs<ExtArgs>>): Prisma__TwitchClient<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Twitch.
     * @param {TwitchUpdateArgs} args - Arguments to update one Twitch.
     * @example
     * // Update one Twitch
     * const twitch = await prisma.twitch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TwitchUpdateArgs>(args: SelectSubset<T, TwitchUpdateArgs<ExtArgs>>): Prisma__TwitchClient<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Twitches.
     * @param {TwitchDeleteManyArgs} args - Arguments to filter Twitches to delete.
     * @example
     * // Delete a few Twitches
     * const { count } = await prisma.twitch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TwitchDeleteManyArgs>(args?: SelectSubset<T, TwitchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Twitches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Twitches
     * const twitch = await prisma.twitch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TwitchUpdateManyArgs>(args: SelectSubset<T, TwitchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Twitches and returns the data updated in the database.
     * @param {TwitchUpdateManyAndReturnArgs} args - Arguments to update many Twitches.
     * @example
     * // Update many Twitches
     * const twitch = await prisma.twitch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Twitches and only return the `streamer_id`
     * const twitchWithStreamer_idOnly = await prisma.twitch.updateManyAndReturn({
     *   select: { streamer_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TwitchUpdateManyAndReturnArgs>(args: SelectSubset<T, TwitchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Twitch.
     * @param {TwitchUpsertArgs} args - Arguments to update or create a Twitch.
     * @example
     * // Update or create a Twitch
     * const twitch = await prisma.twitch.upsert({
     *   create: {
     *     // ... data to create a Twitch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Twitch we want to update
     *   }
     * })
     */
    upsert<T extends TwitchUpsertArgs>(args: SelectSubset<T, TwitchUpsertArgs<ExtArgs>>): Prisma__TwitchClient<runtime.Types.Result.GetResult<Prisma.$TwitchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Twitches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitchCountArgs} args - Arguments to filter Twitches to count.
     * @example
     * // Count the number of Twitches
     * const count = await prisma.twitch.count({
     *   where: {
     *     // ... the filter for the Twitches we want to count
     *   }
     * })
    **/
    count<T extends TwitchCountArgs>(
      args?: Subset<T, TwitchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends runtime.Types.Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TwitchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Twitch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TwitchAggregateArgs>(args: Subset<T, TwitchAggregateArgs>): Prisma.PrismaPromise<GetTwitchAggregateType<T>>

    /**
     * Group by Twitch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TwitchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TwitchGroupByArgs['orderBy'] }
        : { orderBy?: TwitchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TwitchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTwitchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Twitch model
   */
  readonly fields: TwitchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Twitch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TwitchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
  }




  /**
   * Fields of the Twitch model
   */
  export interface TwitchFieldRefs {
    readonly streamer_id: FieldRef<"Twitch", 'String'>
    readonly guild_id: FieldRef<"Twitch", 'String'>
    readonly channel_id: FieldRef<"Twitch", 'String'>
    readonly role_id: FieldRef<"Twitch", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Twitch findUnique
   */
  export type TwitchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * Filter, which Twitch to fetch.
     */
    where: TwitchWhereUniqueInput
  }

  /**
   * Twitch findUniqueOrThrow
   */
  export type TwitchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * Filter, which Twitch to fetch.
     */
    where: TwitchWhereUniqueInput
  }

  /**
   * Twitch findFirst
   */
  export type TwitchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * Filter, which Twitch to fetch.
     */
    where?: TwitchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Twitches to fetch.
     */
    orderBy?: TwitchOrderByWithRelationInput | TwitchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Twitches.
     */
    cursor?: TwitchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Twitches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Twitches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Twitches.
     */
    distinct?: TwitchScalarFieldEnum | TwitchScalarFieldEnum[]
  }

  /**
   * Twitch findFirstOrThrow
   */
  export type TwitchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * Filter, which Twitch to fetch.
     */
    where?: TwitchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Twitches to fetch.
     */
    orderBy?: TwitchOrderByWithRelationInput | TwitchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Twitches.
     */
    cursor?: TwitchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Twitches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Twitches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Twitches.
     */
    distinct?: TwitchScalarFieldEnum | TwitchScalarFieldEnum[]
  }

  /**
   * Twitch findMany
   */
  export type TwitchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * Filter, which Twitches to fetch.
     */
    where?: TwitchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Twitches to fetch.
     */
    orderBy?: TwitchOrderByWithRelationInput | TwitchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Twitches.
     */
    cursor?: TwitchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Twitches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Twitches.
     */
    skip?: number
    distinct?: TwitchScalarFieldEnum | TwitchScalarFieldEnum[]
  }

  /**
   * Twitch create
   */
  export type TwitchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * The data needed to create a Twitch.
     */
    data: XOR<TwitchCreateInput, TwitchUncheckedCreateInput>
  }

  /**
   * Twitch createMany
   */
  export type TwitchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Twitches.
     */
    data: TwitchCreateManyInput | TwitchCreateManyInput[]
  }

  /**
   * Twitch createManyAndReturn
   */
  export type TwitchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * The data used to create many Twitches.
     */
    data: TwitchCreateManyInput | TwitchCreateManyInput[]
  }

  /**
   * Twitch update
   */
  export type TwitchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * The data needed to update a Twitch.
     */
    data: XOR<TwitchUpdateInput, TwitchUncheckedUpdateInput>
    /**
     * Choose, which Twitch to update.
     */
    where: TwitchWhereUniqueInput
  }

  /**
   * Twitch updateMany
   */
  export type TwitchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Twitches.
     */
    data: XOR<TwitchUpdateManyMutationInput, TwitchUncheckedUpdateManyInput>
    /**
     * Filter which Twitches to update
     */
    where?: TwitchWhereInput
    /**
     * Limit how many Twitches to update.
     */
    limit?: number
  }

  /**
   * Twitch updateManyAndReturn
   */
  export type TwitchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * The data used to update Twitches.
     */
    data: XOR<TwitchUpdateManyMutationInput, TwitchUncheckedUpdateManyInput>
    /**
     * Filter which Twitches to update
     */
    where?: TwitchWhereInput
    /**
     * Limit how many Twitches to update.
     */
    limit?: number
  }

  /**
   * Twitch upsert
   */
  export type TwitchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * The filter to search for the Twitch to update in case it exists.
     */
    where: TwitchWhereUniqueInput
    /**
     * In case the Twitch found by the `where` argument doesn't exist, create a new Twitch with this data.
     */
    create: XOR<TwitchCreateInput, TwitchUncheckedCreateInput>
    /**
     * In case the Twitch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TwitchUpdateInput, TwitchUncheckedUpdateInput>
  }

  /**
   * Twitch delete
   */
  export type TwitchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
    /**
     * Filter which Twitch to delete.
     */
    where: TwitchWhereUniqueInput
  }

  /**
   * Twitch deleteMany
   */
  export type TwitchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Twitches to delete
     */
    where?: TwitchWhereInput
    /**
     * Limit how many Twitches to delete.
     */
    limit?: number
  }

  /**
   * Twitch without action
   */
  export type TwitchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Twitch
     */
    select?: TwitchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Twitch
     */
    omit?: TwitchOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    executed_commands: number | null
    roles: number | null
  }

  export type UserSumAggregateOutputType = {
    executed_commands: number | null
    roles: bigint | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    executed_commands: number | null
    banned: boolean | null
    roles: bigint | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    executed_commands: number | null
    banned: boolean | null
    roles: bigint | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    executed_commands: number
    banned: number
    roles: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    executed_commands?: true
    roles?: true
  }

  export type UserSumAggregateInputType = {
    executed_commands?: true
    roles?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    executed_commands?: true
    banned?: true
    roles?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    executed_commands?: true
    banned?: true
    roles?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    executed_commands?: true
    banned?: true
    roles?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    executed_commands: number
    banned: boolean
    roles: bigint
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean
    executed_commands?: boolean
    banned?: boolean
    roles?: boolean
    user_credentials?: boolean | User$user_credentialsArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean
    executed_commands?: boolean
    banned?: boolean
    roles?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean
    executed_commands?: boolean
    banned?: boolean
    roles?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    executed_commands?: boolean
    banned?: boolean
    roles?: boolean
  }

  export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "executed_commands" | "banned" | "roles", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user_credentials?: boolean | User$user_credentialsArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      user_credentials: Prisma.$UserCredentialsPayload<ExtArgs> | null
    }
    scalars: runtime.Types.Extensions.GetPayloadResult<{
      id: string
      executed_commands: number
      banned: boolean
      roles: bigint
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>

  export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends runtime.Types.Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user_credentials<T extends User$user_credentialsArgs<ExtArgs> = {}>(args?: Subset<T, User$user_credentialsArgs<ExtArgs>>): Prisma__UserCredentialsClient<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  export interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly executed_commands: FieldRef<"User", 'Int'>
    readonly banned: FieldRef<"User", 'Boolean'>
    readonly roles: FieldRef<"User", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.user_credentials
   */
  export type User$user_credentialsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    where?: UserCredentialsWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserCredentials
   */

  export type AggregateUserCredentials = {
    _count: UserCredentialsCountAggregateOutputType | null
    _avg: UserCredentialsAvgAggregateOutputType | null
    _sum: UserCredentialsSumAggregateOutputType | null
    _min: UserCredentialsMinAggregateOutputType | null
    _max: UserCredentialsMaxAggregateOutputType | null
  }

  export type UserCredentialsAvgAggregateOutputType = {
    id: number | null
  }

  export type UserCredentialsSumAggregateOutputType = {
    id: number | null
  }

  export type UserCredentialsMinAggregateOutputType = {
    id: number | null
    user_id: string | null
    access_token: string | null
    refresh_token: string | null
    expires: Date | null
  }

  export type UserCredentialsMaxAggregateOutputType = {
    id: number | null
    user_id: string | null
    access_token: string | null
    refresh_token: string | null
    expires: Date | null
  }

  export type UserCredentialsCountAggregateOutputType = {
    id: number
    user_id: number
    access_token: number
    refresh_token: number
    expires: number
    _all: number
  }


  export type UserCredentialsAvgAggregateInputType = {
    id?: true
  }

  export type UserCredentialsSumAggregateInputType = {
    id?: true
  }

  export type UserCredentialsMinAggregateInputType = {
    id?: true
    user_id?: true
    access_token?: true
    refresh_token?: true
    expires?: true
  }

  export type UserCredentialsMaxAggregateInputType = {
    id?: true
    user_id?: true
    access_token?: true
    refresh_token?: true
    expires?: true
  }

  export type UserCredentialsCountAggregateInputType = {
    id?: true
    user_id?: true
    access_token?: true
    refresh_token?: true
    expires?: true
    _all?: true
  }

  export type UserCredentialsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserCredentials to aggregate.
     */
    where?: UserCredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCredentials to fetch.
     */
    orderBy?: UserCredentialsOrderByWithRelationInput | UserCredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserCredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserCredentials
    **/
    _count?: true | UserCredentialsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserCredentialsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserCredentialsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserCredentialsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserCredentialsMaxAggregateInputType
  }

  export type GetUserCredentialsAggregateType<T extends UserCredentialsAggregateArgs> = {
        [P in keyof T & keyof AggregateUserCredentials]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserCredentials[P]>
      : GetScalarType<T[P], AggregateUserCredentials[P]>
  }




  export type UserCredentialsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: UserCredentialsWhereInput
    orderBy?: UserCredentialsOrderByWithAggregationInput | UserCredentialsOrderByWithAggregationInput[]
    by: UserCredentialsScalarFieldEnum[] | UserCredentialsScalarFieldEnum
    having?: UserCredentialsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCredentialsCountAggregateInputType | true
    _avg?: UserCredentialsAvgAggregateInputType
    _sum?: UserCredentialsSumAggregateInputType
    _min?: UserCredentialsMinAggregateInputType
    _max?: UserCredentialsMaxAggregateInputType
  }

  export type UserCredentialsGroupByOutputType = {
    id: number
    user_id: string
    access_token: string
    refresh_token: string
    expires: Date
    _count: UserCredentialsCountAggregateOutputType | null
    _avg: UserCredentialsAvgAggregateOutputType | null
    _sum: UserCredentialsSumAggregateOutputType | null
    _min: UserCredentialsMinAggregateOutputType | null
    _max: UserCredentialsMaxAggregateOutputType | null
  }

  type GetUserCredentialsGroupByPayload<T extends UserCredentialsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserCredentialsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserCredentialsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserCredentialsGroupByOutputType[P]>
            : GetScalarType<T[P], UserCredentialsGroupByOutputType[P]>
        }
      >
    >


  export type UserCredentialsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCredentials"]>

  export type UserCredentialsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCredentials"]>

  export type UserCredentialsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCredentials"]>

  export type UserCredentialsSelectScalar = {
    id?: boolean
    user_id?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expires?: boolean
  }

  export type UserCredentialsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "access_token" | "refresh_token" | "expires", ExtArgs["result"]["userCredentials"]>
  export type UserCredentialsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserCredentialsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserCredentialsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserCredentialsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserCredentials"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: runtime.Types.Extensions.GetPayloadResult<{
      id: number
      user_id: string
      access_token: string
      refresh_token: string
      expires: Date
    }, ExtArgs["result"]["userCredentials"]>
    composites: {}
  }

  export type UserCredentialsGetPayload<S extends boolean | null | undefined | UserCredentialsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload, S>

  export type UserCredentialsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
    Omit<UserCredentialsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCredentialsCountAggregateInputType | true
    }

  export interface UserCredentialsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserCredentials'], meta: { name: 'UserCredentials' } }
    /**
     * Find zero or one UserCredentials that matches the filter.
     * @param {UserCredentialsFindUniqueArgs} args - Arguments to find a UserCredentials
     * @example
     * // Get one UserCredentials
     * const userCredentials = await prisma.userCredentials.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserCredentialsFindUniqueArgs>(args: SelectSubset<T, UserCredentialsFindUniqueArgs<ExtArgs>>): Prisma__UserCredentialsClient<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserCredentials that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserCredentialsFindUniqueOrThrowArgs} args - Arguments to find a UserCredentials
     * @example
     * // Get one UserCredentials
     * const userCredentials = await prisma.userCredentials.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserCredentialsFindUniqueOrThrowArgs>(args: SelectSubset<T, UserCredentialsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserCredentialsClient<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCredentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCredentialsFindFirstArgs} args - Arguments to find a UserCredentials
     * @example
     * // Get one UserCredentials
     * const userCredentials = await prisma.userCredentials.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserCredentialsFindFirstArgs>(args?: SelectSubset<T, UserCredentialsFindFirstArgs<ExtArgs>>): Prisma__UserCredentialsClient<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCredentials that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCredentialsFindFirstOrThrowArgs} args - Arguments to find a UserCredentials
     * @example
     * // Get one UserCredentials
     * const userCredentials = await prisma.userCredentials.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserCredentialsFindFirstOrThrowArgs>(args?: SelectSubset<T, UserCredentialsFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserCredentialsClient<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserCredentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCredentialsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserCredentials
     * const userCredentials = await prisma.userCredentials.findMany()
     * 
     * // Get first 10 UserCredentials
     * const userCredentials = await prisma.userCredentials.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userCredentialsWithIdOnly = await prisma.userCredentials.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserCredentialsFindManyArgs>(args?: SelectSubset<T, UserCredentialsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserCredentials.
     * @param {UserCredentialsCreateArgs} args - Arguments to create a UserCredentials.
     * @example
     * // Create one UserCredentials
     * const UserCredentials = await prisma.userCredentials.create({
     *   data: {
     *     // ... data to create a UserCredentials
     *   }
     * })
     * 
     */
    create<T extends UserCredentialsCreateArgs>(args: SelectSubset<T, UserCredentialsCreateArgs<ExtArgs>>): Prisma__UserCredentialsClient<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserCredentials.
     * @param {UserCredentialsCreateManyArgs} args - Arguments to create many UserCredentials.
     * @example
     * // Create many UserCredentials
     * const userCredentials = await prisma.userCredentials.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCredentialsCreateManyArgs>(args?: SelectSubset<T, UserCredentialsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserCredentials and returns the data saved in the database.
     * @param {UserCredentialsCreateManyAndReturnArgs} args - Arguments to create many UserCredentials.
     * @example
     * // Create many UserCredentials
     * const userCredentials = await prisma.userCredentials.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserCredentials and only return the `id`
     * const userCredentialsWithIdOnly = await prisma.userCredentials.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCredentialsCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCredentialsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserCredentials.
     * @param {UserCredentialsDeleteArgs} args - Arguments to delete one UserCredentials.
     * @example
     * // Delete one UserCredentials
     * const UserCredentials = await prisma.userCredentials.delete({
     *   where: {
     *     // ... filter to delete one UserCredentials
     *   }
     * })
     * 
     */
    delete<T extends UserCredentialsDeleteArgs>(args: SelectSubset<T, UserCredentialsDeleteArgs<ExtArgs>>): Prisma__UserCredentialsClient<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserCredentials.
     * @param {UserCredentialsUpdateArgs} args - Arguments to update one UserCredentials.
     * @example
     * // Update one UserCredentials
     * const userCredentials = await prisma.userCredentials.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserCredentialsUpdateArgs>(args: SelectSubset<T, UserCredentialsUpdateArgs<ExtArgs>>): Prisma__UserCredentialsClient<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserCredentials.
     * @param {UserCredentialsDeleteManyArgs} args - Arguments to filter UserCredentials to delete.
     * @example
     * // Delete a few UserCredentials
     * const { count } = await prisma.userCredentials.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserCredentialsDeleteManyArgs>(args?: SelectSubset<T, UserCredentialsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCredentialsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserCredentials
     * const userCredentials = await prisma.userCredentials.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserCredentialsUpdateManyArgs>(args: SelectSubset<T, UserCredentialsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCredentials and returns the data updated in the database.
     * @param {UserCredentialsUpdateManyAndReturnArgs} args - Arguments to update many UserCredentials.
     * @example
     * // Update many UserCredentials
     * const userCredentials = await prisma.userCredentials.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserCredentials and only return the `id`
     * const userCredentialsWithIdOnly = await prisma.userCredentials.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserCredentialsUpdateManyAndReturnArgs>(args: SelectSubset<T, UserCredentialsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserCredentials.
     * @param {UserCredentialsUpsertArgs} args - Arguments to update or create a UserCredentials.
     * @example
     * // Update or create a UserCredentials
     * const userCredentials = await prisma.userCredentials.upsert({
     *   create: {
     *     // ... data to create a UserCredentials
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserCredentials we want to update
     *   }
     * })
     */
    upsert<T extends UserCredentialsUpsertArgs>(args: SelectSubset<T, UserCredentialsUpsertArgs<ExtArgs>>): Prisma__UserCredentialsClient<runtime.Types.Result.GetResult<Prisma.$UserCredentialsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCredentialsCountArgs} args - Arguments to filter UserCredentials to count.
     * @example
     * // Count the number of UserCredentials
     * const count = await prisma.userCredentials.count({
     *   where: {
     *     // ... the filter for the UserCredentials we want to count
     *   }
     * })
    **/
    count<T extends UserCredentialsCountArgs>(
      args?: Subset<T, UserCredentialsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends runtime.Types.Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCredentialsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCredentialsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserCredentialsAggregateArgs>(args: Subset<T, UserCredentialsAggregateArgs>): Prisma.PrismaPromise<GetUserCredentialsAggregateType<T>>

    /**
     * Group by UserCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCredentialsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserCredentialsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserCredentialsGroupByArgs['orderBy'] }
        : { orderBy?: UserCredentialsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserCredentialsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserCredentialsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserCredentials model
   */
  readonly fields: UserCredentialsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserCredentials.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserCredentialsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
  }




  /**
   * Fields of the UserCredentials model
   */
  export interface UserCredentialsFieldRefs {
    readonly id: FieldRef<"UserCredentials", 'Int'>
    readonly user_id: FieldRef<"UserCredentials", 'String'>
    readonly access_token: FieldRef<"UserCredentials", 'String'>
    readonly refresh_token: FieldRef<"UserCredentials", 'String'>
    readonly expires: FieldRef<"UserCredentials", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserCredentials findUnique
   */
  export type UserCredentialsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which UserCredentials to fetch.
     */
    where: UserCredentialsWhereUniqueInput
  }

  /**
   * UserCredentials findUniqueOrThrow
   */
  export type UserCredentialsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which UserCredentials to fetch.
     */
    where: UserCredentialsWhereUniqueInput
  }

  /**
   * UserCredentials findFirst
   */
  export type UserCredentialsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which UserCredentials to fetch.
     */
    where?: UserCredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCredentials to fetch.
     */
    orderBy?: UserCredentialsOrderByWithRelationInput | UserCredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCredentials.
     */
    cursor?: UserCredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCredentials.
     */
    distinct?: UserCredentialsScalarFieldEnum | UserCredentialsScalarFieldEnum[]
  }

  /**
   * UserCredentials findFirstOrThrow
   */
  export type UserCredentialsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which UserCredentials to fetch.
     */
    where?: UserCredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCredentials to fetch.
     */
    orderBy?: UserCredentialsOrderByWithRelationInput | UserCredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCredentials.
     */
    cursor?: UserCredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCredentials.
     */
    distinct?: UserCredentialsScalarFieldEnum | UserCredentialsScalarFieldEnum[]
  }

  /**
   * UserCredentials findMany
   */
  export type UserCredentialsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which UserCredentials to fetch.
     */
    where?: UserCredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCredentials to fetch.
     */
    orderBy?: UserCredentialsOrderByWithRelationInput | UserCredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserCredentials.
     */
    cursor?: UserCredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCredentials.
     */
    skip?: number
    distinct?: UserCredentialsScalarFieldEnum | UserCredentialsScalarFieldEnum[]
  }

  /**
   * UserCredentials create
   */
  export type UserCredentialsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    /**
     * The data needed to create a UserCredentials.
     */
    data: XOR<UserCredentialsCreateInput, UserCredentialsUncheckedCreateInput>
  }

  /**
   * UserCredentials createMany
   */
  export type UserCredentialsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserCredentials.
     */
    data: UserCredentialsCreateManyInput | UserCredentialsCreateManyInput[]
  }

  /**
   * UserCredentials createManyAndReturn
   */
  export type UserCredentialsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * The data used to create many UserCredentials.
     */
    data: UserCredentialsCreateManyInput | UserCredentialsCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserCredentials update
   */
  export type UserCredentialsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    /**
     * The data needed to update a UserCredentials.
     */
    data: XOR<UserCredentialsUpdateInput, UserCredentialsUncheckedUpdateInput>
    /**
     * Choose, which UserCredentials to update.
     */
    where: UserCredentialsWhereUniqueInput
  }

  /**
   * UserCredentials updateMany
   */
  export type UserCredentialsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update UserCredentials.
     */
    data: XOR<UserCredentialsUpdateManyMutationInput, UserCredentialsUncheckedUpdateManyInput>
    /**
     * Filter which UserCredentials to update
     */
    where?: UserCredentialsWhereInput
    /**
     * Limit how many UserCredentials to update.
     */
    limit?: number
  }

  /**
   * UserCredentials updateManyAndReturn
   */
  export type UserCredentialsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * The data used to update UserCredentials.
     */
    data: XOR<UserCredentialsUpdateManyMutationInput, UserCredentialsUncheckedUpdateManyInput>
    /**
     * Filter which UserCredentials to update
     */
    where?: UserCredentialsWhereInput
    /**
     * Limit how many UserCredentials to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserCredentials upsert
   */
  export type UserCredentialsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    /**
     * The filter to search for the UserCredentials to update in case it exists.
     */
    where: UserCredentialsWhereUniqueInput
    /**
     * In case the UserCredentials found by the `where` argument doesn't exist, create a new UserCredentials with this data.
     */
    create: XOR<UserCredentialsCreateInput, UserCredentialsUncheckedCreateInput>
    /**
     * In case the UserCredentials was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserCredentialsUpdateInput, UserCredentialsUncheckedUpdateInput>
  }

  /**
   * UserCredentials delete
   */
  export type UserCredentialsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
    /**
     * Filter which UserCredentials to delete.
     */
    where: UserCredentialsWhereUniqueInput
  }

  /**
   * UserCredentials deleteMany
   */
  export type UserCredentialsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserCredentials to delete
     */
    where?: UserCredentialsWhereInput
    /**
     * Limit how many UserCredentials to delete.
     */
    limit?: number
  }

  /**
   * UserCredentials without action
   */
  export type UserCredentialsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCredentials
     */
    select?: UserCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCredentials
     */
    omit?: UserCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCredentialsInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel = runtime.makeStrictEnum({
    Serializable: 'Serializable'
  } as const)

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TwitchScalarFieldEnum = {
    streamer_id: 'streamer_id',
    guild_id: 'guild_id',
    channel_id: 'channel_id',
    role_id: 'role_id'
  } as const

  export type TwitchScalarFieldEnum = (typeof TwitchScalarFieldEnum)[keyof typeof TwitchScalarFieldEnum]


  export const UserScalarFieldEnum = {
    id: 'id',
    executed_commands: 'executed_commands',
    banned: 'banned',
    roles: 'roles'
  } as const

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserCredentialsScalarFieldEnum = {
    id: 'id',
    user_id: 'user_id',
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires: 'expires'
  } as const

  export type UserCredentialsScalarFieldEnum = (typeof UserCredentialsScalarFieldEnum)[keyof typeof UserCredentialsScalarFieldEnum]


  export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
  } as const

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder = {
    first: 'first',
    last: 'last'
  } as const

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type TwitchWhereInput = {
    AND?: TwitchWhereInput | TwitchWhereInput[]
    OR?: TwitchWhereInput[]
    NOT?: TwitchWhereInput | TwitchWhereInput[]
    streamer_id?: StringFilter<"Twitch"> | string
    guild_id?: StringFilter<"Twitch"> | string
    channel_id?: StringFilter<"Twitch"> | string
    role_id?: StringNullableFilter<"Twitch"> | string | null
  }

  export type TwitchOrderByWithRelationInput = {
    streamer_id?: SortOrder
    guild_id?: SortOrder
    channel_id?: SortOrder
    role_id?: SortOrderInput | SortOrder
  }

  export type TwitchWhereUniqueInput = Prisma.AtLeast<{
    streamer_id_guild_id?: TwitchStreamer_idGuild_idCompoundUniqueInput
    AND?: TwitchWhereInput | TwitchWhereInput[]
    OR?: TwitchWhereInput[]
    NOT?: TwitchWhereInput | TwitchWhereInput[]
    streamer_id?: StringFilter<"Twitch"> | string
    guild_id?: StringFilter<"Twitch"> | string
    channel_id?: StringFilter<"Twitch"> | string
    role_id?: StringNullableFilter<"Twitch"> | string | null
  }, "streamer_id_guild_id">

  export type TwitchOrderByWithAggregationInput = {
    streamer_id?: SortOrder
    guild_id?: SortOrder
    channel_id?: SortOrder
    role_id?: SortOrderInput | SortOrder
    _count?: TwitchCountOrderByAggregateInput
    _max?: TwitchMaxOrderByAggregateInput
    _min?: TwitchMinOrderByAggregateInput
  }

  export type TwitchScalarWhereWithAggregatesInput = {
    AND?: TwitchScalarWhereWithAggregatesInput | TwitchScalarWhereWithAggregatesInput[]
    OR?: TwitchScalarWhereWithAggregatesInput[]
    NOT?: TwitchScalarWhereWithAggregatesInput | TwitchScalarWhereWithAggregatesInput[]
    streamer_id?: StringWithAggregatesFilter<"Twitch"> | string
    guild_id?: StringWithAggregatesFilter<"Twitch"> | string
    channel_id?: StringWithAggregatesFilter<"Twitch"> | string
    role_id?: StringNullableWithAggregatesFilter<"Twitch"> | string | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    executed_commands?: IntFilter<"User"> | number
    banned?: BoolFilter<"User"> | boolean
    roles?: BigIntFilter<"User"> | bigint | number
    user_credentials?: XOR<UserCredentialsNullableScalarRelationFilter, UserCredentialsWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    executed_commands?: SortOrder
    banned?: SortOrder
    roles?: SortOrder
    user_credentials?: UserCredentialsOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    executed_commands?: IntFilter<"User"> | number
    banned?: BoolFilter<"User"> | boolean
    roles?: BigIntFilter<"User"> | bigint | number
    user_credentials?: XOR<UserCredentialsNullableScalarRelationFilter, UserCredentialsWhereInput> | null
  }, "id">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    executed_commands?: SortOrder
    banned?: SortOrder
    roles?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    executed_commands?: IntWithAggregatesFilter<"User"> | number
    banned?: BoolWithAggregatesFilter<"User"> | boolean
    roles?: BigIntWithAggregatesFilter<"User"> | bigint | number
  }

  export type UserCredentialsWhereInput = {
    AND?: UserCredentialsWhereInput | UserCredentialsWhereInput[]
    OR?: UserCredentialsWhereInput[]
    NOT?: UserCredentialsWhereInput | UserCredentialsWhereInput[]
    id?: IntFilter<"UserCredentials"> | number
    user_id?: StringFilter<"UserCredentials"> | string
    access_token?: StringFilter<"UserCredentials"> | string
    refresh_token?: StringFilter<"UserCredentials"> | string
    expires?: DateTimeFilter<"UserCredentials"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserCredentialsOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserCredentialsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    user_id?: string
    AND?: UserCredentialsWhereInput | UserCredentialsWhereInput[]
    OR?: UserCredentialsWhereInput[]
    NOT?: UserCredentialsWhereInput | UserCredentialsWhereInput[]
    access_token?: StringFilter<"UserCredentials"> | string
    refresh_token?: StringFilter<"UserCredentials"> | string
    expires?: DateTimeFilter<"UserCredentials"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "user_id">

  export type UserCredentialsOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires?: SortOrder
    _count?: UserCredentialsCountOrderByAggregateInput
    _avg?: UserCredentialsAvgOrderByAggregateInput
    _max?: UserCredentialsMaxOrderByAggregateInput
    _min?: UserCredentialsMinOrderByAggregateInput
    _sum?: UserCredentialsSumOrderByAggregateInput
  }

  export type UserCredentialsScalarWhereWithAggregatesInput = {
    AND?: UserCredentialsScalarWhereWithAggregatesInput | UserCredentialsScalarWhereWithAggregatesInput[]
    OR?: UserCredentialsScalarWhereWithAggregatesInput[]
    NOT?: UserCredentialsScalarWhereWithAggregatesInput | UserCredentialsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserCredentials"> | number
    user_id?: StringWithAggregatesFilter<"UserCredentials"> | string
    access_token?: StringWithAggregatesFilter<"UserCredentials"> | string
    refresh_token?: StringWithAggregatesFilter<"UserCredentials"> | string
    expires?: DateTimeWithAggregatesFilter<"UserCredentials"> | Date | string
  }

  export type TwitchCreateInput = {
    streamer_id: string
    guild_id: string
    channel_id: string
    role_id?: string | null
  }

  export type TwitchUncheckedCreateInput = {
    streamer_id: string
    guild_id: string
    channel_id: string
    role_id?: string | null
  }

  export type TwitchUpdateInput = {
    streamer_id?: StringFieldUpdateOperationsInput | string
    guild_id?: StringFieldUpdateOperationsInput | string
    channel_id?: StringFieldUpdateOperationsInput | string
    role_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TwitchUncheckedUpdateInput = {
    streamer_id?: StringFieldUpdateOperationsInput | string
    guild_id?: StringFieldUpdateOperationsInput | string
    channel_id?: StringFieldUpdateOperationsInput | string
    role_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TwitchCreateManyInput = {
    streamer_id: string
    guild_id: string
    channel_id: string
    role_id?: string | null
  }

  export type TwitchUpdateManyMutationInput = {
    streamer_id?: StringFieldUpdateOperationsInput | string
    guild_id?: StringFieldUpdateOperationsInput | string
    channel_id?: StringFieldUpdateOperationsInput | string
    role_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TwitchUncheckedUpdateManyInput = {
    streamer_id?: StringFieldUpdateOperationsInput | string
    guild_id?: StringFieldUpdateOperationsInput | string
    channel_id?: StringFieldUpdateOperationsInput | string
    role_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateInput = {
    id: string
    executed_commands?: number
    banned?: boolean
    roles?: bigint | number
    user_credentials?: UserCredentialsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    executed_commands?: number
    banned?: boolean
    roles?: bigint | number
    user_credentials?: UserCredentialsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed_commands?: IntFieldUpdateOperationsInput | number
    banned?: BoolFieldUpdateOperationsInput | boolean
    roles?: BigIntFieldUpdateOperationsInput | bigint | number
    user_credentials?: UserCredentialsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed_commands?: IntFieldUpdateOperationsInput | number
    banned?: BoolFieldUpdateOperationsInput | boolean
    roles?: BigIntFieldUpdateOperationsInput | bigint | number
    user_credentials?: UserCredentialsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    executed_commands?: number
    banned?: boolean
    roles?: bigint | number
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed_commands?: IntFieldUpdateOperationsInput | number
    banned?: BoolFieldUpdateOperationsInput | boolean
    roles?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed_commands?: IntFieldUpdateOperationsInput | number
    banned?: BoolFieldUpdateOperationsInput | boolean
    roles?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UserCredentialsCreateInput = {
    access_token: string
    refresh_token: string
    expires: Date | string
    user: UserCreateNestedOneWithoutUser_credentialsInput
  }

  export type UserCredentialsUncheckedCreateInput = {
    id?: number
    user_id: string
    access_token: string
    refresh_token: string
    expires: Date | string
  }

  export type UserCredentialsUpdateInput = {
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUser_credentialsNestedInput
  }

  export type UserCredentialsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCredentialsCreateManyInput = {
    id?: number
    user_id: string
    access_token: string
    refresh_token: string
    expires: Date | string
  }

  export type UserCredentialsUpdateManyMutationInput = {
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCredentialsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TwitchStreamer_idGuild_idCompoundUniqueInput = {
    streamer_id: string
    guild_id: string
  }

  export type TwitchCountOrderByAggregateInput = {
    streamer_id?: SortOrder
    guild_id?: SortOrder
    channel_id?: SortOrder
    role_id?: SortOrder
  }

  export type TwitchMaxOrderByAggregateInput = {
    streamer_id?: SortOrder
    guild_id?: SortOrder
    channel_id?: SortOrder
    role_id?: SortOrder
  }

  export type TwitchMinOrderByAggregateInput = {
    streamer_id?: SortOrder
    guild_id?: SortOrder
    channel_id?: SortOrder
    role_id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type UserCredentialsNullableScalarRelationFilter = {
    is?: UserCredentialsWhereInput | null
    isNot?: UserCredentialsWhereInput | null
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    executed_commands?: SortOrder
    banned?: SortOrder
    roles?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    executed_commands?: SortOrder
    roles?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    executed_commands?: SortOrder
    banned?: SortOrder
    roles?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    executed_commands?: SortOrder
    banned?: SortOrder
    roles?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    executed_commands?: SortOrder
    roles?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserCredentialsCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires?: SortOrder
  }

  export type UserCredentialsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserCredentialsMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires?: SortOrder
  }

  export type UserCredentialsMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires?: SortOrder
  }

  export type UserCredentialsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserCredentialsCreateNestedOneWithoutUserInput = {
    create?: XOR<UserCredentialsCreateWithoutUserInput, UserCredentialsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCredentialsCreateOrConnectWithoutUserInput
    connect?: UserCredentialsWhereUniqueInput
  }

  export type UserCredentialsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserCredentialsCreateWithoutUserInput, UserCredentialsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCredentialsCreateOrConnectWithoutUserInput
    connect?: UserCredentialsWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type UserCredentialsUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserCredentialsCreateWithoutUserInput, UserCredentialsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCredentialsCreateOrConnectWithoutUserInput
    upsert?: UserCredentialsUpsertWithoutUserInput
    disconnect?: UserCredentialsWhereInput | boolean
    delete?: UserCredentialsWhereInput | boolean
    connect?: UserCredentialsWhereUniqueInput
    update?: XOR<XOR<UserCredentialsUpdateToOneWithWhereWithoutUserInput, UserCredentialsUpdateWithoutUserInput>, UserCredentialsUncheckedUpdateWithoutUserInput>
  }

  export type UserCredentialsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserCredentialsCreateWithoutUserInput, UserCredentialsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCredentialsCreateOrConnectWithoutUserInput
    upsert?: UserCredentialsUpsertWithoutUserInput
    disconnect?: UserCredentialsWhereInput | boolean
    delete?: UserCredentialsWhereInput | boolean
    connect?: UserCredentialsWhereUniqueInput
    update?: XOR<XOR<UserCredentialsUpdateToOneWithWhereWithoutUserInput, UserCredentialsUpdateWithoutUserInput>, UserCredentialsUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutUser_credentialsInput = {
    create?: XOR<UserCreateWithoutUser_credentialsInput, UserUncheckedCreateWithoutUser_credentialsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUser_credentialsInput
    connect?: UserWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutUser_credentialsNestedInput = {
    create?: XOR<UserCreateWithoutUser_credentialsInput, UserUncheckedCreateWithoutUser_credentialsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUser_credentialsInput
    upsert?: UserUpsertWithoutUser_credentialsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUser_credentialsInput, UserUpdateWithoutUser_credentialsInput>, UserUncheckedUpdateWithoutUser_credentialsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserCredentialsCreateWithoutUserInput = {
    access_token: string
    refresh_token: string
    expires: Date | string
  }

  export type UserCredentialsUncheckedCreateWithoutUserInput = {
    id?: number
    access_token: string
    refresh_token: string
    expires: Date | string
  }

  export type UserCredentialsCreateOrConnectWithoutUserInput = {
    where: UserCredentialsWhereUniqueInput
    create: XOR<UserCredentialsCreateWithoutUserInput, UserCredentialsUncheckedCreateWithoutUserInput>
  }

  export type UserCredentialsUpsertWithoutUserInput = {
    update: XOR<UserCredentialsUpdateWithoutUserInput, UserCredentialsUncheckedUpdateWithoutUserInput>
    create: XOR<UserCredentialsCreateWithoutUserInput, UserCredentialsUncheckedCreateWithoutUserInput>
    where?: UserCredentialsWhereInput
  }

  export type UserCredentialsUpdateToOneWithWhereWithoutUserInput = {
    where?: UserCredentialsWhereInput
    data: XOR<UserCredentialsUpdateWithoutUserInput, UserCredentialsUncheckedUpdateWithoutUserInput>
  }

  export type UserCredentialsUpdateWithoutUserInput = {
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCredentialsUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutUser_credentialsInput = {
    id: string
    executed_commands?: number
    banned?: boolean
    roles?: bigint | number
  }

  export type UserUncheckedCreateWithoutUser_credentialsInput = {
    id: string
    executed_commands?: number
    banned?: boolean
    roles?: bigint | number
  }

  export type UserCreateOrConnectWithoutUser_credentialsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUser_credentialsInput, UserUncheckedCreateWithoutUser_credentialsInput>
  }

  export type UserUpsertWithoutUser_credentialsInput = {
    update: XOR<UserUpdateWithoutUser_credentialsInput, UserUncheckedUpdateWithoutUser_credentialsInput>
    create: XOR<UserCreateWithoutUser_credentialsInput, UserUncheckedCreateWithoutUser_credentialsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUser_credentialsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUser_credentialsInput, UserUncheckedUpdateWithoutUser_credentialsInput>
  }

  export type UserUpdateWithoutUser_credentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed_commands?: IntFieldUpdateOperationsInput | number
    banned?: BoolFieldUpdateOperationsInput | boolean
    roles?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UserUncheckedUpdateWithoutUser_credentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed_commands?: IntFieldUpdateOperationsInput | number
    banned?: BoolFieldUpdateOperationsInput | boolean
    roles?: BigIntFieldUpdateOperationsInput | bigint | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }
}