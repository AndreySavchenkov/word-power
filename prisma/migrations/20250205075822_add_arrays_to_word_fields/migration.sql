/*
  Warnings:

  - The `definition` column on the `Word` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the column `partOfSpeech` on the `Word` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
ALTER TABLE "Word" 
ADD COLUMN "new_partOfSpeech" "PartOfSpeech"[] DEFAULT ARRAY[]::"PartOfSpeech"[],
ADD COLUMN "new_definition" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Копируем данные
UPDATE "Word"
SET 
  "new_partOfSpeech" = ARRAY["partOfSpeech"]::"PartOfSpeech"[],
  "new_definition" = ARRAY["definition"];

-- Удаляем старые колонки
ALTER TABLE "Word" 
DROP COLUMN "partOfSpeech",
DROP COLUMN "definition";

-- Переименовываем новые колонки
ALTER TABLE "Word" 
RENAME COLUMN "new_partOfSpeech" TO "partOfSpeech";

ALTER TABLE "Word" 
RENAME COLUMN "new_definition" TO "definition";
