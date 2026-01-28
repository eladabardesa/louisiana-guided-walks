/*
  Warnings:

  - Made the column `phone` on table `Submission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "ticketQuantity" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Submission_selectedDate_idx" ON "Submission"("selectedDate");
