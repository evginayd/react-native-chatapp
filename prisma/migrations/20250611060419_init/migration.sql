-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('TEMP', 'FRIEND', 'GROUP');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "lastOnline" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "type" "ChatType" NOT NULL DEFAULT 'TEMP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isTemporary" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatParticipant" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "ParticipantRole" NOT NULL DEFAULT 'MEMBER',
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "ChatParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hobby" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserHobbies" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserHobbies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userId_friendId_key" ON "Friendship"("userId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_chatId_userId_key" ON "ChatParticipant"("chatId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Hobby_name_key" ON "Hobby"("name");

-- CreateIndex
CREATE INDEX "_UserHobbies_B_index" ON "_UserHobbies"("B");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHobbies" ADD CONSTRAINT "_UserHobbies_A_fkey" FOREIGN KEY ("A") REFERENCES "Hobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHobbies" ADD CONSTRAINT "_UserHobbies_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
