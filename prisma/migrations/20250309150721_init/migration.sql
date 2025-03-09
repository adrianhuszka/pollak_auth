-- CreateTable
CREATE TABLE "APIKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "k" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groups" (
    "neve" TEXT NOT NULL,
    "write" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("neve")
);

-- CreateTable
CREATE TABLE "maindata" (
    "id" TEXT NOT NULL,
    "JWTSecret" VARCHAR(512) NOT NULL,
    "JWTExpiration" INTEGER NOT NULL,
    "JWTAlgorithm" TEXT NOT NULL,
    "RefreshTokenSecret" VARCHAR(512) NOT NULL,
    "RefreshTokenExpiration" INTEGER NOT NULL,
    "RefreshTokenAlgorithm" TEXT NOT NULL,

    CONSTRAINT "maindata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OM" (
    "kod" TEXT NOT NULL,
    "name" VARCHAR(1024),

    CONSTRAINT "OM_pkey" PRIMARY KEY ("kod")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ForgotToken" VARCHAR(100),
    "ForgotTokenExpiresAt" TIMESTAMP(3),
    "googleId" VARCHAR(100),
    "isMFAEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "om" TEXT NOT NULL,
    "groupsNeve" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "APIKey_k_key" ON "APIKey"("k");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_ForgotToken_key" ON "User"("ForgotToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_om_key" ON "User"("om");

-- AddForeignKey
ALTER TABLE "APIKey" ADD CONSTRAINT "APIKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "APIKey" ADD CONSTRAINT "APIKey_userGroupId_fkey" FOREIGN KEY ("userGroupId") REFERENCES "Groups"("neve") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_om_fkey" FOREIGN KEY ("om") REFERENCES "OM"("kod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupsNeve_fkey" FOREIGN KEY ("groupsNeve") REFERENCES "Groups"("neve") ON DELETE RESTRICT ON UPDATE CASCADE;
