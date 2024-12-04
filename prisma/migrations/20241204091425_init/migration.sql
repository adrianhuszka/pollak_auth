/*
  Warnings:

  - A unique constraint covering the columns `[ForgotToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `ForgotToken` VARCHAR(100) NULL,
    ADD COLUMN `ForgotTokenExpiresAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_ForgotToken_key` ON `User`(`ForgotToken`);
