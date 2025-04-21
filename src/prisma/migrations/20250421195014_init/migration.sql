-- CreateTable
CREATE TABLE "Twitch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "streamer_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "role_id" TEXT
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "executed_commands" INTEGER NOT NULL DEFAULT 0,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "roles" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "users_credentials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "users_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
