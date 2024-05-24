/*
  Warnings:

  - You are about to drop the column `status` on the `bids` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bids" DROP CONSTRAINT "bids_auctionId_fkey";

-- AlterTable
ALTER TABLE "bids" DROP COLUMN "status";

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
