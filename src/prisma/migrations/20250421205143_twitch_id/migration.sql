/*
  Warnings:

  - The primary key for the `Twitch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Twitch` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Twitch" (
    "streamer_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "role_id" TEXT,

    PRIMARY KEY ("streamer_id", "guild_id")
);
INSERT INTO "new_Twitch" ("channel_id", "guild_id", "role_id", "streamer_id") SELECT "channel_id", "guild_id", "role_id", "streamer_id" FROM "Twitch";
DROP TABLE "Twitch";
ALTER TABLE "new_Twitch" RENAME TO "Twitch";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
