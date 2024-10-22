-- CreateTable
CREATE TABLE `Groups` (
    `neve` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`neve`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OM` (
    `kod` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`kod`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nev` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `om` VARCHAR(191) NOT NULL,
    `groupsNeve` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_om_key`(`om`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_om_fkey` FOREIGN KEY (`om`) REFERENCES `OM`(`kod`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_groupsNeve_fkey` FOREIGN KEY (`groupsNeve`) REFERENCES `Groups`(`neve`) ON DELETE RESTRICT ON UPDATE CASCADE;
