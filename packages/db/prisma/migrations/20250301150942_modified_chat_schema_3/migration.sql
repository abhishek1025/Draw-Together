/*
  Warnings:

  - The values [SHAPE] on the enum `ChatType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChatType_new" AS ENUM ('DRAW', 'MESSAGE');
ALTER TABLE "Chat" ALTER COLUMN "chatType" TYPE "ChatType_new" USING ("chatType"::text::"ChatType_new");
ALTER TYPE "ChatType" RENAME TO "ChatType_old";
ALTER TYPE "ChatType_new" RENAME TO "ChatType";
DROP TYPE "ChatType_old";
COMMIT;
