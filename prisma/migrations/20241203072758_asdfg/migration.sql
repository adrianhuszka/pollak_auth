/*
  Warnings:

  - You are about to alter the column `RefreshTokenExpiration` on the `maindata` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `maindata` MODIFY `RefreshTokenExpiration` INTEGER NOT NULL;
