ALTER TABLE "attendances" ADD COLUMN "work_date" DATE;

UPDATE "attendances"
SET "work_date" = ("recorded_at" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta')::date;

DELETE FROM "attendances" AS later
USING "attendances" AS earlier
WHERE later."employee_id" = earlier."employee_id"
  AND later."work_date" = earlier."work_date"
  AND later."type" = earlier."type"
  AND (later."recorded_at", later."id") > (earlier."recorded_at", earlier."id");

ALTER TABLE "attendances" ALTER COLUMN "work_date" SET NOT NULL;

CREATE UNIQUE INDEX "attendances_employee_id_work_date_type_key" ON "attendances"("employee_id", "work_date", "type");
