/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `users_credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_credentials_user_id_key" ON "users_credentials"("user_id");
