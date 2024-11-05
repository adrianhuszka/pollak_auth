-- CreateTable
CREATE TABLE `maindata` (
    `id` VARCHAR(191) NOT NULL,
    `JWTSecret` VARCHAR(191) NOT NULL,
    `JWTExpiration` INTEGER NOT NULL,
    `JWTAlgorithm` VARCHAR(191) NOT NULL,
    `RefreshTokenSecret` VARCHAR(191) NOT NULL,
    `RefreshTokenExpiration` VARCHAR(191) NOT NULL,
    `RefreshTokenAlgorithm` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
