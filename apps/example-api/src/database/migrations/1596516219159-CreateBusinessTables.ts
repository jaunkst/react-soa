import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateBusinessTables1596516219159 implements MigrationInterface {
    name = 'CreateBusinessTables1596516219159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "business_review" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "businessId" integer, "ratingScore" integer NOT NULL, "customerComment" varchar(128), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "operating_city" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_a1c6eb114eb8047a42aa5a0cae4" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "work_type" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_5b42876fa5f17be509e0c50b31a" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "business" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "avgRatingScore" integer DEFAULT (0), "addressLine1" varchar(128) NOT NULL, "addressLine2" varchar(128), "city" varchar(128) NOT NULL, "stateAbbr" varchar(128) NOT NULL, "postal" varchar(128) NOT NULL, "name" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "business_operation_window" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "businessId" integer, "dayOfWeek" integer NOT NULL, "open" integer NOT NULL, "close" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "business_operating_cities_operating_city" ("businessId" integer NOT NULL, "operatingCityId" integer NOT NULL, PRIMARY KEY ("businessId", "operatingCityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9be6de6c46406fc063391fec3b" ON "business_operating_cities_operating_city" ("businessId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f23a217c3302bc0341854fc27" ON "business_operating_cities_operating_city" ("operatingCityId") `);
        await queryRunner.query(`CREATE TABLE "business_work_types_work_type" ("businessId" integer NOT NULL, "workTypeId" integer NOT NULL, PRIMARY KEY ("businessId", "workTypeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6c801605dbd3f695d80948bbaf" ON "business_work_types_work_type" ("businessId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8ce0ce0f18bc3030074c477308" ON "business_work_types_work_type" ("workTypeId") `);
        await queryRunner.query(`CREATE TABLE "temporary_business_review" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "businessId" integer, "ratingScore" integer NOT NULL, "customerComment" varchar(128), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_af6fe039b5e2ad66a1c7f06117b" FOREIGN KEY ("businessId") REFERENCES "business" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_business_review"("id", "businessId", "ratingScore", "customerComment", "createdAt", "updatedAt") SELECT "id", "businessId", "ratingScore", "customerComment", "createdAt", "updatedAt" FROM "business_review"`);
        await queryRunner.query(`DROP TABLE "business_review"`);
        await queryRunner.query(`ALTER TABLE "temporary_business_review" RENAME TO "business_review"`);
        await queryRunner.query(`CREATE TABLE "temporary_business_operation_window" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "businessId" integer, "dayOfWeek" integer NOT NULL, "open" integer NOT NULL, "close" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_c0e8d9ca183787366d9e44cf181" FOREIGN KEY ("businessId") REFERENCES "business" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_business_operation_window"("id", "businessId", "dayOfWeek", "open", "close", "createdAt", "updatedAt") SELECT "id", "businessId", "dayOfWeek", "open", "close", "createdAt", "updatedAt" FROM "business_operation_window"`);
        await queryRunner.query(`DROP TABLE "business_operation_window"`);
        await queryRunner.query(`ALTER TABLE "temporary_business_operation_window" RENAME TO "business_operation_window"`);
        await queryRunner.query(`DROP INDEX "IDX_9be6de6c46406fc063391fec3b"`);
        await queryRunner.query(`DROP INDEX "IDX_3f23a217c3302bc0341854fc27"`);
        await queryRunner.query(`CREATE TABLE "temporary_business_operating_cities_operating_city" ("businessId" integer NOT NULL, "operatingCityId" integer NOT NULL, CONSTRAINT "FK_9be6de6c46406fc063391fec3bb" FOREIGN KEY ("businessId") REFERENCES "business" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_3f23a217c3302bc0341854fc27a" FOREIGN KEY ("operatingCityId") REFERENCES "operating_city" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("businessId", "operatingCityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_business_operating_cities_operating_city"("businessId", "operatingCityId") SELECT "businessId", "operatingCityId" FROM "business_operating_cities_operating_city"`);
        await queryRunner.query(`DROP TABLE "business_operating_cities_operating_city"`);
        await queryRunner.query(`ALTER TABLE "temporary_business_operating_cities_operating_city" RENAME TO "business_operating_cities_operating_city"`);
        await queryRunner.query(`CREATE INDEX "IDX_9be6de6c46406fc063391fec3b" ON "business_operating_cities_operating_city" ("businessId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f23a217c3302bc0341854fc27" ON "business_operating_cities_operating_city" ("operatingCityId") `);
        await queryRunner.query(`DROP INDEX "IDX_6c801605dbd3f695d80948bbaf"`);
        await queryRunner.query(`DROP INDEX "IDX_8ce0ce0f18bc3030074c477308"`);
        await queryRunner.query(`CREATE TABLE "temporary_business_work_types_work_type" ("businessId" integer NOT NULL, "workTypeId" integer NOT NULL, CONSTRAINT "FK_6c801605dbd3f695d80948bbaf5" FOREIGN KEY ("businessId") REFERENCES "business" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_8ce0ce0f18bc3030074c4773087" FOREIGN KEY ("workTypeId") REFERENCES "work_type" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("businessId", "workTypeId"))`);
        await queryRunner.query(`INSERT INTO "temporary_business_work_types_work_type"("businessId", "workTypeId") SELECT "businessId", "workTypeId" FROM "business_work_types_work_type"`);
        await queryRunner.query(`DROP TABLE "business_work_types_work_type"`);
        await queryRunner.query(`ALTER TABLE "temporary_business_work_types_work_type" RENAME TO "business_work_types_work_type"`);
        await queryRunner.query(`CREATE INDEX "IDX_6c801605dbd3f695d80948bbaf" ON "business_work_types_work_type" ("businessId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8ce0ce0f18bc3030074c477308" ON "business_work_types_work_type" ("workTypeId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_8ce0ce0f18bc3030074c477308"`);
        await queryRunner.query(`DROP INDEX "IDX_6c801605dbd3f695d80948bbaf"`);
        await queryRunner.query(`ALTER TABLE "business_work_types_work_type" RENAME TO "temporary_business_work_types_work_type"`);
        await queryRunner.query(`CREATE TABLE "business_work_types_work_type" ("businessId" integer NOT NULL, "workTypeId" integer NOT NULL, PRIMARY KEY ("businessId", "workTypeId"))`);
        await queryRunner.query(`INSERT INTO "business_work_types_work_type"("businessId", "workTypeId") SELECT "businessId", "workTypeId" FROM "temporary_business_work_types_work_type"`);
        await queryRunner.query(`DROP TABLE "temporary_business_work_types_work_type"`);
        await queryRunner.query(`CREATE INDEX "IDX_8ce0ce0f18bc3030074c477308" ON "business_work_types_work_type" ("workTypeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6c801605dbd3f695d80948bbaf" ON "business_work_types_work_type" ("businessId") `);
        await queryRunner.query(`DROP INDEX "IDX_3f23a217c3302bc0341854fc27"`);
        await queryRunner.query(`DROP INDEX "IDX_9be6de6c46406fc063391fec3b"`);
        await queryRunner.query(`ALTER TABLE "business_operating_cities_operating_city" RENAME TO "temporary_business_operating_cities_operating_city"`);
        await queryRunner.query(`CREATE TABLE "business_operating_cities_operating_city" ("businessId" integer NOT NULL, "operatingCityId" integer NOT NULL, PRIMARY KEY ("businessId", "operatingCityId"))`);
        await queryRunner.query(`INSERT INTO "business_operating_cities_operating_city"("businessId", "operatingCityId") SELECT "businessId", "operatingCityId" FROM "temporary_business_operating_cities_operating_city"`);
        await queryRunner.query(`DROP TABLE "temporary_business_operating_cities_operating_city"`);
        await queryRunner.query(`CREATE INDEX "IDX_3f23a217c3302bc0341854fc27" ON "business_operating_cities_operating_city" ("operatingCityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9be6de6c46406fc063391fec3b" ON "business_operating_cities_operating_city" ("businessId") `);
        await queryRunner.query(`ALTER TABLE "business_operation_window" RENAME TO "temporary_business_operation_window"`);
        await queryRunner.query(`CREATE TABLE "business_operation_window" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "businessId" integer, "dayOfWeek" integer NOT NULL, "open" integer NOT NULL, "close" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "business_operation_window"("id", "businessId", "dayOfWeek", "open", "close", "createdAt", "updatedAt") SELECT "id", "businessId", "dayOfWeek", "open", "close", "createdAt", "updatedAt" FROM "temporary_business_operation_window"`);
        await queryRunner.query(`DROP TABLE "temporary_business_operation_window"`);
        await queryRunner.query(`ALTER TABLE "business_review" RENAME TO "temporary_business_review"`);
        await queryRunner.query(`CREATE TABLE "business_review" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "businessId" integer, "ratingScore" integer NOT NULL, "customerComment" varchar(128), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "business_review"("id", "businessId", "ratingScore", "customerComment", "createdAt", "updatedAt") SELECT "id", "businessId", "ratingScore", "customerComment", "createdAt", "updatedAt" FROM "temporary_business_review"`);
        await queryRunner.query(`DROP TABLE "temporary_business_review"`);
        await queryRunner.query(`DROP INDEX "IDX_8ce0ce0f18bc3030074c477308"`);
        await queryRunner.query(`DROP INDEX "IDX_6c801605dbd3f695d80948bbaf"`);
        await queryRunner.query(`DROP TABLE "business_work_types_work_type"`);
        await queryRunner.query(`DROP INDEX "IDX_3f23a217c3302bc0341854fc27"`);
        await queryRunner.query(`DROP INDEX "IDX_9be6de6c46406fc063391fec3b"`);
        await queryRunner.query(`DROP TABLE "business_operating_cities_operating_city"`);
        await queryRunner.query(`DROP TABLE "business_operation_window"`);
        await queryRunner.query(`DROP TABLE "business"`);
        await queryRunner.query(`DROP TABLE "work_type"`);
        await queryRunner.query(`DROP TABLE "operating_city"`);
        await queryRunner.query(`DROP TABLE "business_review"`);
    }

}
