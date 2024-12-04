/*
  Warnings:

  - You are about to alter the column `RefreshTokenExpiration` on the `maindata` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `groups` ADD COLUMN `delete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `read` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `update` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `write` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `maindata` MODIFY `RefreshTokenExpiration` INTEGER NOT NULL;
