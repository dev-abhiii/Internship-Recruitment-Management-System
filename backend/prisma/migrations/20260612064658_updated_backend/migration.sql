/*
  Warnings:

  - You are about to drop the column `resume` on the `applications` table. All the data in the column will be lost.
  - Added the required column `resumeUrl` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" DROP COLUMN "resume",
ADD COLUMN     "resumeUrl" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'APPLIED';
